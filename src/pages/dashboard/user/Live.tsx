/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Video,
  User,
  Square,
  EyeOff,
  Mic,
  MicOff,
  Loader2,
  Calendar,
  Clock,
  Lock,
  Globe,
} from "lucide-react";
import AgoraRTC from "agora-rtc-sdk-ng";
import type {
  IAgoraRTCClient,
  ICameraVideoTrack,
  IMicrophoneAudioTrack,
  IRemoteVideoTrack,
  IRemoteAudioTrack,
} from "agora-rtc-sdk-ng";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { BASE_URL } from "@/lib/Base_URL";
import { jwtDecode } from "jwt-decode";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

interface Stream {
  id: string;
  _id?: string;
  event?: {
    id: string;
    title: string;
    description: string;
  };
  streamer: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  title: string;
  description?: string;
  channelName: string;
  streamStatus: "scheduled" | "starting" | "live" | "ended" | "cancelled";
  isLive: boolean;
  currentViewers: number;
  maxViewers: number;
  streamType: "public" | "private" | "ticketed";
  streamingMode?: "communication" | "live";
  scheduledStartTime?: string;
  liveStartedAt?: string;
  isUpcoming: boolean;
  isActive: boolean;
  requiresApproval: boolean;
  tags: string[];
  thumbnail?: string;
  playbackUrl?: string;
  hlsUrl?: string;
  createdAt: string;
  updatedAt: string;
}

interface JwtPayload {
  authId: string;
  userId: string;
  email: string;
  role: string;
}

interface RemoteUser {
  uid: string;
  videoTrack?: IRemoteVideoTrack;
  audioTrack?: IRemoteAudioTrack;
}

interface AgoraTokenResponse {
  token: string;
  channelName: string;
  uid: number;
  role: "publisher" | "subscriber";
  expireTime: number;
  streamingMode: string;
}

interface LiveProps {
  onStreamChange?: (streamId: string | null) => void;
}

const Live = ({ onStreamChange }: LiveProps = {}) => {
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreatingStream, setIsCreatingStream] = useState(false);
  const [streams, setStreams] = useState<Stream[]>([]);
  const [activeStream, setActiveStream] = useState<Stream | null>(null);

  // Notify parent component about stream change
  useEffect(() => {
    if (onStreamChange) {
      onStreamChange(activeStream ? activeStream.id : null);
    }
  }, [activeStream, onStreamChange]);
  const [localVideoTrack, setLocalVideoTrack] =
    useState<ICameraVideoTrack | null>(null);
  const [localAudioTrack, setLocalAudioTrack] =
    useState<IMicrophoneAudioTrack | null>(null);
  const [remoteUsers, setRemoteUsers] = useState<Map<string, RemoteUser>>(
    new Map()
  );
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);

  // Stream creation form
  const [newStreamTitle, setNewStreamTitle] = useState("");
  const [newStreamDescription, setNewStreamDescription] = useState("");
  const [newStreamType, setNewStreamType] = useState<
    "public" | "private" | "ticketed"
  >("public");
  const [newStreamTags, setNewStreamTags] = useState<string>("");
  const [newStreamMaxViewers, setNewStreamMaxViewers] =
    useState<string>("10000");
  const [requiresApproval, setRequiresApproval] = useState(false);
  const [chatEnabled, setChatEnabled] = useState(true);
  const [isRecorded, setIsRecorded] = useState(false);
  const [scheduledStartTime, setScheduledStartTime] = useState<string>("");

  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);

  const clientRef = useRef<IAgoraRTCClient | null>(null);
  const localVideoContainerRef = useRef<HTMLDivElement>(null);
  const remoteVideoContainerRef = useRef<HTMLDivElement>(null);

  // Effect to play local video track when available and container is ready
  useEffect(() => {
    if (localVideoTrack && localVideoContainerRef.current) {
      console.log("Playing local video track");
      localVideoContainerRef.current.innerHTML = "";
      const videoElement = document.createElement("div");
      videoElement.className = "w-full h-full";
      localVideoContainerRef.current.appendChild(videoElement);
      localVideoTrack.play(videoElement);
    }
  }, [localVideoTrack, isBroadcasting, activeStream]);
  const remoteUsersRef = useRef<Map<string, RemoteUser>>(new Map());

  // Get auth token from localStorage
  const getToken = () => {
    return localStorage.getItem("accessToken") || localStorage.getItem("token");
  };

  // Get current user ID from token
  const getCurrentUserId = (): string | null => {
    const token = getToken();
    if (!token) return null;

    try {
      const decoded = jwtDecode<JwtPayload>(token);
      return decoded.authId || decoded.userId;
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  };

  // Check if camera is available
  const checkCameraAvailability = async (): Promise<boolean> => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(
        (device) => device.kind === "videoinput"
      );
      return videoDevices.length > 0;
    } catch (error) {
      console.error("Error checking camera:", error);
      return false;
    }
  };

  // Initialize Agora client
  const initializeAgoraClient = () => {
    if (!clientRef.current) {
      try {
        clientRef.current = AgoraRTC.createClient({
          mode: "live",
          codec: "vp8",
        });

        // Handle user published (when someone starts streaming)
        clientRef.current.on("user-published", async (user, mediaType) => {
          console.log("User published:", user.uid, mediaType);

          try {
            await clientRef.current!.subscribe(user, mediaType);
            console.log("Subscribed to user:", user.uid, mediaType);

            if (mediaType === "video") {
              const videoTrack = user.videoTrack;
              if (videoTrack) {
                const newRemoteUser: RemoteUser = {
                  uid: user.uid.toString(),
                  videoTrack,
                };

                remoteUsersRef.current.set(user.uid.toString(), newRemoteUser);
                setRemoteUsers(new Map(remoteUsersRef.current));

                setTimeout(() => {
                  if (remoteVideoContainerRef.current) {
                    remoteVideoContainerRef.current.innerHTML = "";
                    const videoElement = document.createElement("div");
                    videoElement.id = `remote-video-${user.uid}`;
                    videoElement.className = "w-full h-full";
                    remoteVideoContainerRef.current.appendChild(videoElement);
                    videoTrack.play(videoElement);
                  }
                }, 100);
              }
            }

            if (mediaType === "audio") {
              const audioTrack = user.audioTrack;
              if (audioTrack) {
                audioTrack.play();
              }
            }
          } catch (error) {
            console.error("Error subscribing to user:", error);
          }
        });

        // Handle user unpublished (when someone stops streaming)
        clientRef.current.on("user-unpublished", (user, mediaType) => {
          console.log("User unpublished:", user.uid, mediaType);

          if (mediaType === "video") {
            const remoteUser = remoteUsersRef.current.get(user.uid.toString());
            if (remoteUser?.videoTrack) {
              remoteUser.videoTrack.stop();
            }
            remoteUsersRef.current.delete(user.uid.toString());
            setRemoteUsers(new Map(remoteUsersRef.current));

            const videoElement = document.getElementById(
              `remote-video-${user.uid}`
            );
            if (videoElement) {
              videoElement.remove();
            }
          }
        });

        // Handle user joined
        clientRef.current.on("user-joined", (user) => {
          console.log("User joined:", user.uid);
        });

        // Handle user left
        clientRef.current.on("user-left", (user) => {
          console.log("User left:", user.uid);

          const remoteUser = remoteUsersRef.current.get(user.uid.toString());
          if (remoteUser?.videoTrack) {
            remoteUser.videoTrack.stop();
          }

          remoteUsersRef.current.delete(user.uid.toString());
          setRemoteUsers(new Map(remoteUsersRef.current));

          const videoElement = document.getElementById(
            `remote-video-${user.uid}`
          );
          if (videoElement) {
            videoElement.remove();
          }
        });

        setIsInitialized(true);
        console.log("Agora client initialized successfully");
      } catch (error) {
        console.error("Error initializing Agora client:", error);
        toast.error("Failed to initialize video streaming");
      }
    }
  };

  useEffect(() => {
    // Initialize Agora client
    initializeAgoraClient();

    // Get current user ID
    const userId = getCurrentUserId();
    setCurrentUserId(userId);

    // Load existing streams
    fetchStreams();

    return () => {
      cleanupAgora();
    };
  }, []);

  // Clean up Agora resources
  const cleanupAgora = async () => {
    try {
      if (
        clientRef.current &&
        clientRef.current.connectionState === "CONNECTED"
      ) {
        await clientRef.current.leave();
        console.log("Left Agora channel");
      }

      if (localVideoTrack) {
        localVideoTrack.stop();
        localVideoTrack.close();
        setLocalVideoTrack(null);
      }

      if (localAudioTrack) {
        localAudioTrack.stop();
        localAudioTrack.close();
        setLocalAudioTrack(null);
      }

      if (localStream) {
        localStream.getTracks().forEach((track) => {
          track.stop();
        });
        setLocalStream(null);
      }

      remoteUsersRef.current.clear();
      setRemoteUsers(new Map());

      setIsBroadcasting(false);

      // Clear video containers
      if (localVideoContainerRef.current) {
        localVideoContainerRef.current.innerHTML = "";
      }
      if (remoteVideoContainerRef.current) {
        remoteVideoContainerRef.current.innerHTML = "";
      }
    } catch (error) {
      console.error("Error cleaning up Agora:", error);
    }
  };

  // Fetch live streams with pagination
  const fetchStreams = async (page = 1, limit = 20) => {
    setIsLoading(true);
    try {
      const token = getToken();
      const response = await fetch(
        `${BASE_URL}/livestream?page=${page}&limit=${limit}&sortBy=createdAt&sortOrder=desc`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      if (data.success) {
        setStreams(data.data);
      } else {
        toast.error(data.message || "Failed to load streams");
      }
    } catch (error) {
      console.error("Error fetching streams:", error);
      toast.error("Failed to load streams");
    } finally {
      setIsLoading(false);
    }
  };

  // Create a new live stream
  const createLiveStream = async () => {
    if (!newStreamTitle.trim()) {
      toast.error("Please enter a stream title");
      return;
    }

    setIsCreatingStream(true);
    try {
      const token = getToken();

      const payload: any = {
        title: newStreamTitle,
        description: newStreamDescription,
        streamType: newStreamType,
        maxViewers: parseInt(newStreamMaxViewers) || 10000,
        chatEnabled: chatEnabled,
        isRecorded: isRecorded,
        requiresApproval: requiresApproval,
        eventId: "693f22de052f55bd278c40c8",
      };

      // Add tags if provided
      if (newStreamTags.trim()) {
        payload.tags = newStreamTags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag);
      }

      // Add scheduled start time if provided
      if (scheduledStartTime) {
        payload.scheduledStartTime = scheduledStartTime;
      }

      const response = await fetch(`${BASE_URL}/livestream`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Stream created successfully!");

        // Reset form
        setNewStreamTitle("");
        setNewStreamDescription("");
        setNewStreamType("public");
        setNewStreamTags("");
        setNewStreamMaxViewers("10000");
        setRequiresApproval(false);
        setChatEnabled(true);
        setIsRecorded(false);
        setScheduledStartTime("");

        setShowCreateDialog(false);
        fetchStreams();
      } else {
        throw new Error(data.message || "Failed to create stream");
      }
    } catch (error: any) {
      console.error("Error creating stream:", error);
      toast.error(error.message || "Failed to create stream");
    } finally {
      setIsCreatingStream(false);
    }
  };

  // Get Agora token from backend
  const getAgoraToken = async (
    streamId: string,
    role: "broadcaster" | "viewer"
  ): Promise<AgoraTokenResponse> => {
    try {
      const token = getToken();
      const response = await fetch(
        `${BASE_URL}/livestream/${streamId}/token?role=${role}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      if (data.success) {
        return data.data;
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error("Error getting token:", error);
      throw error;
    }
  };

  // Setup broadcaster with local tracks
  const setupBroadcaster = async (tokenData: AgoraTokenResponse) => {
    try {
      // Initialize client if not already
      if (!isInitialized) {
        initializeAgoraClient();
        await new Promise((resolve) => setTimeout(resolve, 100));
      }

      // Check if camera is available
      const hasCamera = await checkCameraAvailability();
      if (!hasCamera) {
        toast.error("No camera found on your device");
        throw new Error("No camera found");
      }

      // Cleanup existing tracks
      await cleanupAgora();

      // Create local tracks
      let cameraTrack: ICameraVideoTrack;
      let microphoneTrack: IMicrophoneAudioTrack;

      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 1280 },
            height: { ideal: 720 },
            frameRate: { ideal: 30 },
          },
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
          },
        });

        setLocalStream(mediaStream);
        cameraTrack = await AgoraRTC.createCameraVideoTrack();
        microphoneTrack = await AgoraRTC.createMicrophoneAudioTrack();

        setLocalVideoTrack(cameraTrack);
        setLocalAudioTrack(microphoneTrack);
        setIsVideoEnabled(true);
        setIsAudioEnabled(true);
      } catch (error: any) {
        console.error("Error getting media devices:", error);

        if (
          error.name === "NotAllowedError" ||
          error.name === "PermissionDeniedError"
        ) {
          toast.error(
            "Please allow camera and microphone access to start streaming"
          );
        } else if (
          error.name === "NotFoundError" ||
          error.name === "DevicesNotFoundError"
        ) {
          toast.error("No camera or microphone found on your device");
        } else if (
          error.name === "NotReadableError" ||
          error.name === "TrackStartError"
        ) {
          toast.error(
            "Camera is already in use by another application. Please close other apps using your camera."
          );
        } else {
          toast.error(
            "Failed to access camera/microphone: " +
              (error.message || "Unknown error")
          );
        }
        throw error;
      }

      // Join channel as broadcaster
      // Note: App ID is now handled by backend token generation
      // We need to set the mode based on streamingMode from backend
      if (tokenData.streamingMode === "communication") {
        // For interactive streaming
        await clientRef.current!.join(
          "9476d1c9b94d48f3a6f312798aa6c3a6",
          tokenData.channelName,
          tokenData.token,
          tokenData.uid || null
        );
      } else {
        // For standard live streaming
        await clientRef.current!.join(
          "9476d1c9b94d48f3a6f312798aa6c3a6",
          tokenData.channelName,
          tokenData.token,
          tokenData.uid || null
        );
      }

      // Set client role based on role from token
      await clientRef.current!.setClientRole(
        tokenData.role === "publisher" ? "host" : "audience"
      );

      // Publish local tracks if broadcaster
      if (tokenData.role === "publisher") {
        await clientRef.current!.publish([cameraTrack, microphoneTrack]);
      }

      console.log("Broadcaster setup complete");
    } catch (error: any) {
      console.error("Error setting up broadcaster:", error);
      toast.error(error.message || "Failed to setup broadcaster");
      throw error;
    }
  };

  // Start existing stream as broadcaster
  const startExistingBroadcast = async (streamId: string) => {
    setIsLoading(true);
    try {
      const token = getToken();
      const stream = streams.find((s) => s.id === streamId);

      if (!stream) {
        toast.error("Stream not found");
        return;
      }

      // Check if user is the streamer
      if (!isUserStreamer(stream)) {
        toast.error("Only the streamer can start the broadcast");
        return;
      }

      // Check if stream is already live
      if (stream?.isLive) {
        toast.info("Stream is already live. Joining as broadcaster...");
        const tokenData = await getAgoraToken(streamId, "broadcaster");
        await setupBroadcaster(tokenData);
        setIsBroadcasting(true);
        setActiveStream(stream);
        toast.success("Joined existing live stream!");
      } else {
        // 1. Start the stream on backend
        const startResponse = await fetch(
          `${BASE_URL}/livestream/${streamId}/start`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const startData = await startResponse.json();

        if (!startData.success) {
          if (startData.message?.includes("already live")) {
            toast.info("Stream is already live. Joining as broadcaster...");
            const tokenData = await getAgoraToken(streamId, "broadcaster");
            await setupBroadcaster(tokenData);
            setIsBroadcasting(true);
            setActiveStream(stream);
            toast.success("Joined existing live stream!");
          } else {
            throw new Error(startData.message);
          }
        } else {
          // 2. Get broadcaster token
          const tokenData = await getAgoraToken(streamId, "broadcaster");

          // 3. Setup broadcaster
          await setupBroadcaster(tokenData);

          setIsBroadcasting(true);
          setActiveStream(startData.data);
          toast.success("Live broadcast started!");
        }
      }

      fetchStreams();
    } catch (error: any) {
      console.error("Error starting broadcast:", error);
      toast.error(error.message || "Failed to start broadcast");
    } finally {
      setIsLoading(false);
    }
  };

  // Stop broadcasting
  const stopBroadcast = async () => {
    if (!activeStream) return;

    setIsLoading(true);
    try {
      const token = getToken();

      // 1. Unpublish and close local tracks
      if (localVideoTrack) {
        if (clientRef.current) {
          await clientRef.current.unpublish(localVideoTrack);
        }
        localVideoTrack.stop();
        localVideoTrack.close();
        setLocalVideoTrack(null);
      }

      if (localAudioTrack) {
        if (clientRef.current) {
          await clientRef.current.unpublish(localAudioTrack);
        }
        localAudioTrack.stop();
        localAudioTrack.close();
        setLocalAudioTrack(null);
      }

      if (localStream) {
        localStream.getTracks().forEach((track) => track.stop());
        setLocalStream(null);
      }

      // 2. Leave channel
      if (
        clientRef.current &&
        clientRef.current.connectionState === "CONNECTED"
      ) {
        await clientRef.current.leave();
      }

      // 3. End the stream on backend
      const endResponse = await fetch(
        `${BASE_URL}/livestream/${activeStream.id}/end`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const endData = await endResponse.json();

      if (!endData.success) {
        console.warn("Failed to end stream on backend:", endData.message);
      }

      // 4. Cleanup state
      setIsBroadcasting(false);
      setActiveStream(null);
      remoteUsersRef.current.clear();
      setRemoteUsers(new Map());

      // Clear video containers
      if (localVideoContainerRef.current) {
        localVideoContainerRef.current.innerHTML = "";
      }
      if (remoteVideoContainerRef.current) {
        remoteVideoContainerRef.current.innerHTML = "";
      }

      toast.success("Broadcast ended");

      // Refresh streams
      fetchStreams();
    } catch (error) {
      console.error("Error stopping broadcast:", error);
      toast.error("Failed to stop broadcast");
    } finally {
      setIsLoading(false);
    }
  };

  // Join as viewer
  const joinAsViewer = async (streamId: string) => {
    setIsLoading(true);
    try {
      // Cleanup existing connection
      await cleanupAgora();

      // Initialize client if not already
      if (!isInitialized) {
        initializeAgoraClient();
        await new Promise((resolve) => setTimeout(resolve, 100));
      }

      // Clear remote container
      if (remoteVideoContainerRef.current) {
        remoteVideoContainerRef.current.innerHTML = "";
      }

      // Get viewer token
      const tokenData = await getAgoraToken(streamId, "viewer");

      // Join channel as audience
      await clientRef.current!.join(
        "9476d1c9b94d48f3a6f312798aa6c3a6",
        tokenData.channelName,
        tokenData.token,
        tokenData.uid || null
      );

      // Set client role to audience
      await clientRef.current!.setClientRole("audience");

      const stream = streams.find((s) => s.id === streamId);
      setActiveStream(stream || null);

      toast.success("Joined stream as viewer");

      console.log("Viewer joined successfully, waiting for broadcaster...");
    } catch (error: any) {
      console.error("Error joining stream:", error);

      // Handle specific authorization errors
      if (error.message?.includes("not authorized")) {
        toast.error("You are not authorized to view this private stream");
      } else if (error.message?.includes("Stream is not active")) {
        toast.error("This stream is not currently active");
      } else {
        toast.error(error.message || "Failed to join stream");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Leave viewer stream
  const leaveViewerStream = async () => {
    try {
      await cleanupAgora();
      setActiveStream(null);
      toast.success("Left the stream");
    } catch (error) {
      console.error("Error leaving stream:", error);
      toast.error("Failed to leave stream");
    }
  };

  // Toggle video
  const toggleVideo = async () => {
    if (localVideoTrack) {
      try {
        if (isVideoEnabled) {
          await localVideoTrack.setEnabled(false);
          setIsVideoEnabled(false);
          toast.info("Video turned off");
        } else {
          await localVideoTrack.setEnabled(true);
          setIsVideoEnabled(true);
          toast.info("Video turned on");
        }
      } catch (error) {
        console.error("Error toggling video:", error);
        toast.error("Failed to toggle video");
      }
    }
  };

  // Toggle audio
  const toggleAudio = async () => {
    if (localAudioTrack) {
      try {
        if (isAudioEnabled) {
          await localAudioTrack.setEnabled(false);
          setIsAudioEnabled(false);
          toast.info("Microphone muted");
        } else {
          await localAudioTrack.setEnabled(true);
          setIsAudioEnabled(true);
          toast.info("Microphone unmuted");
        }
      } catch (error) {
        console.error("Error toggling audio:", error);
        toast.error("Failed to toggle audio");
      }
    }
  };

  // Check if user is the streamer
  const isUserStreamer = (stream: Stream) => {
    if (!currentUserId) return false;
    return stream.streamer.id === currentUserId;
  };

  // Format date for display
  const formatDate = (dateString?: string) => {
    if (!dateString) return "Not scheduled";
    const date = new Date(dateString);
    return (
      date.toLocaleDateString() +
      " " +
      date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    );
  };

  // Get stream type icon
  const getStreamTypeIcon = (type: string) => {
    switch (type) {
      case "private":
        return <Lock className="w-3 h-3" />;
      case "ticketed":
        return <Square className="w-3 h-3" />;
      default:
        return <Globe className="w-3 h-3" />;
    }
  };

  // Reset create stream form
  const resetCreateForm = () => {
    setNewStreamTitle("");
    setNewStreamDescription("");
    setNewStreamType("public");
    setNewStreamTags("");
    setNewStreamMaxViewers("10000");
    setRequiresApproval(false);
    setChatEnabled(true);
    setIsRecorded(false);
    setScheduledStartTime("");
  };

  return (
    <div className="h-full w-full bg-gray-950 relative text-white overflow-hidden group font-sans">
      {activeStream || isBroadcasting ? (
        <>
          {/* Video Container Layer */}
          <div className="absolute inset-0 z-0 bg-black">
            {/* Remote Video (Viewers see this) */}
            <div
              ref={remoteVideoContainerRef}
              className={`w-full h-full object-cover transition-opacity duration-500 ${
                isBroadcasting ? "opacity-0" : "opacity-100"
              }`}
            />
            {/* Local Video (Broadcaster sees this) */}
            <div
              ref={localVideoContainerRef}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
                isBroadcasting ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
            />

            {/* Placeholder if no video */}
            {!activeStream && !isBroadcasting && !localStream && (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <Video className="w-16 h-16 opacity-20 mb-4" />
                <p>Waiting for stream...</p>
              </div>
            )}
          </div>

          {/* Gradient Overlay Layer */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/90 z-10 pointer-events-none" />

          {/* Top Info Bar */}
          <div className="absolute top-0 left-0 right-0 p-4 md:p-6 flex justify-between items-start z-20 pointer-events-none">
            <div className="flex items-center gap-3">
              {(isBroadcasting || (activeStream && activeStream.isLive)) && (
                <div className="bg-red-600 text-white px-3 py-1 rounded-full flex items-center gap-2 animate-pulse shadow-lg shadow-red-900/20">
                  <div className="w-2 h-2 bg-white rounded-full" />
                  <span className="text-xs font-bold tracking-wider uppercase">
                    LIVE
                  </span>
                </div>
              )}
              {activeStream && (
                <div className="flex items-center gap-2">
                  <div className="flex items-center bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                    {getStreamTypeIcon(activeStream.streamType)}
                    <span className="text-xs ml-1 capitalize">
                      {activeStream.streamType}
                    </span>
                  </div>
                  {activeStream.requiresApproval && (
                    <Badge
                      variant="outline"
                      className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
                    >
                      Approval Required
                    </Badge>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center bg-black/40 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10 shadow-xl">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                <span className="text-sm font-semibold tracking-wide">
                  {remoteUsers.size + (isBroadcasting ? 0 : 1)} watching
                </span>
              </div>
            </div>
          </div>

          {/* Stream Info Sidebar */}
          <div className="absolute left-4 top-20 z-20 w-72 bg-black/40 backdrop-blur-md rounded-xl border border-white/10 p-4 hidden md:block">
            {activeStream && (
              <>
                <h3 className="font-bold text-lg mb-3">{activeStream.title}</h3>
                <p className="text-sm text-gray-300 mb-4">
                  {activeStream.description}
                </p>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">
                      Host: {activeStream.streamer.name}
                    </span>
                  </div>

                  {activeStream.scheduledStartTime && (
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-sm">
                        {formatDate(activeStream.scheduledStartTime)}
                      </span>
                    </div>
                  )}

                  {activeStream.tags && activeStream.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {activeStream.tags.map((tag, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="text-xs bg-purple-500/20 text-purple-300 border-purple-500/30"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Bottom Info Area */}
          <div className="absolute bottom-0 left-0 right-0 p-6 z-20 pointer-events-none">
            <div className="mb-1 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
              <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight drop-shadow-lg mb-2">
                {activeStream?.title || newStreamTitle || "Live Stream"}
              </h1>

              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-gray-300 font-medium text-sm md:text-base">
                  <span className="text-white uppercase tracking-wider font-bold">
                    Streaming Now
                  </span>
                  <span className="w-1 h-1 bg-gray-500 rounded-full" />
                  <span>{activeStream?.description || "Live Session"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Floating Controls (User Interaction) */}
          <div className="absolute bottom-20 right-4 z-50 flex flex-col gap-3 pointer-events-auto">
            {!isBroadcasting && (
              <Button
                variant="destructive"
                size="icon"
                className="rounded-full h-12 w-12 shadow-xl border-2 border-white/10"
                onClick={leaveViewerStream}
              >
                <Square className="h-5 w-5 fill-current" />
              </Button>
            )}

            {isBroadcasting && (
              <>
                <Button
                  variant={isVideoEnabled ? "secondary" : "destructive"}
                  size="icon"
                  className="rounded-full h-10 w-10 shadow-lg"
                  onClick={toggleVideo}
                >
                  {isVideoEnabled ? (
                    <Video className="h-4 w-4" />
                  ) : (
                    <EyeOff className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  variant={isAudioEnabled ? "secondary" : "destructive"}
                  size="icon"
                  className="rounded-full h-10 w-10 shadow-lg"
                  onClick={toggleAudio}
                >
                  {isAudioEnabled ? (
                    <Mic className="h-4 w-4" />
                  ) : (
                    <MicOff className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  variant="destructive"
                  size="icon"
                  className="rounded-full h-12 w-12 shadow-xl border-2 border-white/10"
                  onClick={stopBroadcast}
                >
                  <Square className="h-5 w-5 fill-current" />
                </Button>
              </>
            )}
          </div>
        </>
      ) : (
        // List View when no stream is active
        <div className="absolute inset-0 flex flex-col p-4 overflow-y-auto custom-scrollbar">
          <div className="flex justify-between items-center mb-6 sticky top-0 bg-gray-950/90 backdrop-blur-sm py-2 z-10">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
              Live Streams
            </h2>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => fetchStreams()}
                className="border-gray-800 hover:bg-gray-800 text-gray-400"
              >
                <Loader2
                  className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
                />
              </Button>
              <Dialog
                open={showCreateDialog}
                onOpenChange={(open) => {
                  setShowCreateDialog(open);
                  if (!open) resetCreateForm();
                }}
              >
                <DialogTrigger asChild>
                  <Button
                    size="sm"
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    <Video className="w-4 h-4 mr-2" />
                    Go Live
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-md">
                  <DialogHeader>
                    <DialogTitle>Create New Live Stream</DialogTitle>
                    <DialogDescription className="text-gray-400">
                      Configure your live stream settings
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label className="text-gray-300">Stream Title *</Label>
                      <Input
                        value={newStreamTitle}
                        onChange={(e) => setNewStreamTitle(e.target.value)}
                        className="bg-gray-950 border-gray-800 text-white"
                        placeholder="Enter stream title"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-300">Description</Label>
                      <Textarea
                        value={newStreamDescription}
                        onChange={(e) =>
                          setNewStreamDescription(e.target.value)
                        }
                        className="bg-gray-950 border-gray-800 text-white"
                        placeholder="Describe your stream"
                        rows={3}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-300">Stream Type</Label>
                      <Select
                        value={newStreamType}
                        onValueChange={(value: any) => setNewStreamType(value)}
                      >
                        <SelectTrigger className="bg-gray-950 border-gray-800 text-white">
                          <SelectValue placeholder="Select stream type" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-900 border-gray-800 text-white">
                          <SelectItem value="public">Public</SelectItem>
                          <SelectItem value="private">Private</SelectItem>
                          <SelectItem value="ticketed">Ticketed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-300">
                        Tags (comma separated)
                      </Label>
                      <Input
                        value={newStreamTags}
                        onChange={(e) => setNewStreamTags(e.target.value)}
                        className="bg-gray-950 border-gray-800 text-white"
                        placeholder="music, gaming, tutorial"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-300">Max Viewers</Label>
                      <Input
                        value={newStreamMaxViewers}
                        onChange={(e) => setNewStreamMaxViewers(e.target.value)}
                        className="bg-gray-950 border-gray-800 text-white"
                        type="number"
                        min="1"
                        max="100000"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-300">
                        Scheduled Start Time (Optional)
                      </Label>
                      <Input
                        value={scheduledStartTime}
                        onChange={(e) => setScheduledStartTime(e.target.value)}
                        className="bg-gray-950 border-gray-800 text-white"
                        type="datetime-local"
                      />
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label className="text-gray-300">
                          Requires Approval
                        </Label>
                        <Switch
                          checked={requiresApproval}
                          onCheckedChange={setRequiresApproval}
                          className="data-[state=checked]:bg-purple-600"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label className="text-gray-300">Enable Chat</Label>
                        <Switch
                          checked={chatEnabled}
                          onCheckedChange={setChatEnabled}
                          className="data-[state=checked]:bg-purple-600"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label className="text-gray-300">Record Stream</Label>
                        <Switch
                          checked={isRecorded}
                          onCheckedChange={setIsRecorded}
                          className="data-[state=checked]:bg-purple-600"
                        />
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      onClick={createLiveStream}
                      disabled={!newStreamTitle.trim() || isCreatingStream}
                      className="bg-purple-600 hover:bg-purple-700 w-full"
                    >
                      {isCreatingStream ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Creating...
                        </>
                      ) : (
                        "Create Stream"
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <div className="grid gap-4">
            {streams.map((stream) => (
              <div
                key={stream.id}
                className="group flex items-start gap-4 p-4 rounded-xl bg-gray-900/50 hover:bg-gradient-to-r hover:from-purple-900/20 hover:to-pink-900/20 border border-gray-800 hover:border-purple-500/30 transition-all cursor-pointer"
                onClick={() => {
                  if (isUserStreamer(stream)) {
                    startExistingBroadcast(stream.id);
                  } else {
                    joinAsViewer(stream.id);
                  }
                }}
              >
                <div className="relative w-24 h-16 rounded-lg bg-gray-800 flex items-center justify-center overflow-hidden shrink-0 group-hover:scale-105 transition-transform">
                  {stream.isLive ? (
                    <div
                      className="absolute inset-0 bg-cover bg-center"
                      style={{
                        backgroundImage: `url(${
                          stream.thumbnail ||
                          stream.streamer.avatar ||
                          "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?w=800&auto=format&fit=crop&q=60"
                        })`,
                      }}
                    >
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-ping" />
                      </div>
                    </div>
                  ) : stream.isUpcoming ? (
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-900/50 to-purple-900/50 flex items-center justify-center">
                      <Clock className="w-6 h-6 text-blue-400" />
                    </div>
                  ) : (
                    <Video className="w-6 h-6 text-gray-600" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-semibold text-white truncate pr-2">
                      {stream.title}
                    </h3>
                    <div className="flex items-center gap-2">
                      {stream.isLive && (
                        <span className="text-xs font-bold text-red-500 bg-red-500/10 px-2 py-0.5 rounded-full uppercase flex items-center gap-1">
                          <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                          Live
                        </span>
                      )}
                      {stream.isUpcoming && !stream.isLive && (
                        <Badge
                          variant="outline"
                          className="text-xs bg-blue-500/10 text-blue-300 border-blue-500/30"
                        >
                          Upcoming
                        </Badge>
                      )}
                      <div className="flex items-center gap-1 text-xs text-gray-400">
                        {getStreamTypeIcon(stream.streamType)}
                        <span className="capitalize">{stream.streamType}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-400 truncate mb-2">
                    {stream.streamer.name}
                  </p>

                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    {stream.tags?.slice(0, 3).map((tag, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="text-xs bg-gray-800 text-gray-400 hover:bg-gray-750"
                      >
                        {tag}
                      </Badge>
                    ))}

                    <div className="flex items-center gap-3 text-xs text-gray-500 ml-auto">
                      <span className="flex items-center">
                        <User className="w-3 h-3 mr-1" />{" "}
                        {stream.currentViewers}
                      </span>
                      {stream.scheduledStartTime && (
                        <span className="flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          {new Date(
                            stream.scheduledStartTime
                          ).toLocaleDateString()}
                        </span>
                      )}
                      {stream.streamStatus === "ended" && (
                        <Badge
                          variant="outline"
                          className="text-xs bg-gray-800 text-gray-400"
                        >
                          Ended
                        </Badge>
                      )}
                    </div>
                  </div>

                  {stream.description && (
                    <p className="text-xs text-gray-500 mt-2 line-clamp-2">
                      {stream.description}
                    </p>
                  )}
                </div>
              </div>
            ))}

            {streams.length === 0 && !isLoading && (
              <div className="text-center py-10 opacity-50">
                <Video className="w-12 h-12 mx-auto mb-2" />
                <p>No active streams found</p>
                <p className="text-sm text-gray-500 mt-1">
                  Be the first to start streaming!
                </p>
              </div>
            )}

            {isLoading && streams.length === 0 && (
              <div className="text-center py-10">
                <Loader2 className="w-12 h-12 mx-auto mb-2 animate-spin text-purple-500" />
                <p>Loading streams...</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Live;
