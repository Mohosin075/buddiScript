/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Video,
  User,
  Users,
  Clock,
  Play,
  Square,
  Eye,
  EyeOff,
  Mic,
  MicOff,
  MessageSquare,
  Plus,
  Loader2,
} from "lucide-react";
import AgoraRTC from "agora-rtc-sdk-ng";
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
  scheduledStartTime?: string;
  liveStartedAt?: string;
  isUpcoming: boolean;
  isActive: boolean;
}

interface JwtPayload {
  authId: string;
  email: string;
  role: string;
}

const Live = () => {
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreatingStream, setIsCreatingStream] = useState(false);
  const [streams, setStreams] = useState<Stream[]>([]);
  const [activeStream, setActiveStream] = useState<Stream | null>(null);
  const [localVideoTrack, setLocalVideoTrack] = useState<any>(null);
  const [localAudioTrack, setLocalAudioTrack] = useState<any>(null);
  const [remoteUsers, setRemoteUsers] = useState<Set<string>>(new Set());
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isChatEnabled, setIsChatEnabled] = useState(true);
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState<
    Array<{ user: string; message: string; time: string }>
  >([]);
  const [newStreamTitle, setNewStreamTitle] = useState("");
  const [newStreamDescription, setNewStreamDescription] = useState("");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const clientRef = useRef<any>(null);
  const localVideoContainerRef = useRef<HTMLDivElement>(null);
  const remoteVideoContainerRef = useRef<HTMLDivElement>(null);

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
      return decoded.authId;
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  };

  // Initialize Agora client
  useEffect(() => {
    clientRef.current = AgoraRTC.createClient({
      mode: "live",
      codec: "vp8",
    });

    // Handle user published
    clientRef.current.on(
      "user-published",
      async (user: any, mediaType: "audio" | "video") => {
        await clientRef.current.subscribe(user, mediaType);

        if (mediaType === "video") {
          const remoteVideoContainer = remoteVideoContainerRef.current;
          if (remoteVideoContainer && user.videoTrack) {
            user.videoTrack.play(remoteVideoContainer);
            setRemoteUsers((prev) => new Set([...prev, user.uid]));
          }
        }

        if (mediaType === "audio") {
          user.audioTrack.play();
        }
      }
    );

    // Handle user unpublished
    clientRef.current.on(
      "user-unpublished",
      (user: any, mediaType: "audio" | "video") => {
        if (mediaType === "video") {
          setRemoteUsers((prev) => {
            const newSet = new Set(prev);
            newSet.delete(user.uid);
            return newSet;
          });
        }
      }
    );

    // Get current user ID
    const userId = getCurrentUserId();
    setCurrentUserId(userId);

    // Load existing streams
    fetchStreams();

    return () => {
      if (clientRef.current?.connectionState === "CONNECTED") {
        clientRef.current.leave();
      }
      if (localVideoTrack) {
        localVideoTrack.close();
      }
      if (localAudioTrack) {
        localAudioTrack.close();
      }
    };
  }, []);

  // Fetch live streams
  const fetchStreams = async () => {
    try {
      const token = getToken();
      const response = await fetch(`${BASE_URL}/livestream`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setStreams(data.data);
      } else {
        toast.error(data.message || "Failed to load streams");
      }
    } catch (error) {
      console.error("Error fetching streams:", error);
      toast.error("Failed to load streams");
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
      const response = await fetch(`${BASE_URL}/livestream`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          eventId: "692762edce1f8de66691cfd8", // You need to provide an actual event ID
          title: newStreamTitle,
          description: newStreamDescription,
          streamType: "public",
          chatEnabled: true,
          channelName: `stream_${Date.now()}`, // Unique channel name
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Stream created successfully!");
        setNewStreamTitle("");
        setNewStreamDescription("");
        setShowCreateDialog(false);
        fetchStreams(); // Refresh the stream list
      } else {
        throw new Error(data.message);
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
  ) => {
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

  // Quick Start: Create and start a stream immediately
  const handleQuickStart = async () => {
    setIsLoading(true);
    try {
      const token = getToken();

      // 1. Create a stream
      const createResponse = await fetch(`${BASE_URL}/livestream`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          eventId: "692762edce1f8de66691cfd8",
          title: "Live Broadcast",
          description: "Started broadcasting now",
          streamType: "public",
          chatEnabled: true,
        }),
      });

      const createData = await createResponse.json();

      if (!createData.success) {
        throw new Error(createData.message);
      }

      const streamId = createData.data._id || createData.data.id;

      // 2. Start the stream
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
        throw new Error(startData.message);
      }

      // 3. Get broadcaster token
      const tokenData = await getAgoraToken(streamId, "broadcaster");

      // 4. Initialize local tracks
      const cameraTrack = await AgoraRTC.createCameraVideoTrack();
      const microphoneTrack = await AgoraRTC.createMicrophoneAudioTrack();

      setLocalVideoTrack(cameraTrack);
      setLocalAudioTrack(microphoneTrack);

      // 5. Join channel
      await clientRef.current.join(
        "9476d1c9b94d48f3a6f312798aa6c3a6", // Your Agora App ID
        tokenData.channelName,
        tokenData.token,
        null
      );

      // 6. Publish local tracks
      await clientRef.current.publish([cameraTrack, microphoneTrack]);

      // 7. Play local video
      if (localVideoContainerRef.current) {
        cameraTrack.play(localVideoContainerRef.current);
      }

      setIsBroadcasting(true);
      setActiveStream(startData.data);
      toast.success("Live broadcast started!");

      // Refresh streams
      fetchStreams();
    } catch (error: any) {
      console.error("Error starting broadcast:", error);
      toast.error(error.message || "Failed to start broadcast");
    } finally {
      setIsLoading(false);
    }
  };

  // Start existing stream as broadcaster
  const startExistingBroadcast = async (streamId: string) => {
    setIsLoading(true);
    try {
      const token = getToken();

      // 1. Start the stream
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
        throw new Error(startData.message);
      }

      // 2. Get broadcaster token
      const tokenData = await getAgoraToken(streamId, "broadcaster");

      // 3. Initialize local tracks
      const cameraTrack = await AgoraRTC.createCameraVideoTrack();
      const microphoneTrack = await AgoraRTC.createMicrophoneAudioTrack();

      setLocalVideoTrack(cameraTrack);
      setLocalAudioTrack(microphoneTrack);

      // 4. Join channel
      await clientRef.current.join(
        "9476d1c9b94d48f3a6f312798aa6c3a6",
        tokenData.channelName,
        tokenData.token,
        null
      );

      // 5. Publish local tracks
      await clientRef.current.publish([cameraTrack, microphoneTrack]);

      // 6. Play local video
      if (localVideoContainerRef.current) {
        cameraTrack.play(localVideoContainerRef.current);
      }

      setIsBroadcasting(true);
      setActiveStream(startData.data);
      toast.success("Live broadcast started!");

      // Refresh streams
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

    try {
      const token = getToken();

      // 1. Unpublish tracks
      if (localVideoTrack) {
        clientRef.current.unpublish(localVideoTrack);
        localVideoTrack.close();
      }
      if (localAudioTrack) {
        clientRef.current.unpublish(localAudioTrack);
        localAudioTrack.close();
      }

      // 2. Leave channel
      await clientRef.current.leave();

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
        throw new Error(endData.message);
      }

      setIsBroadcasting(false);
      setLocalVideoTrack(null);
      setLocalAudioTrack(null);
      setActiveStream(null);
      setRemoteUsers(new Set());
      toast.success("Broadcast ended");

      // Refresh streams
      fetchStreams();
    } catch (error) {
      console.error("Error stopping broadcast:", error);
      toast.error("Failed to stop broadcast");
    }
  };

  // Join as viewer
  const joinAsViewer = async (streamId: string) => {
    setIsLoading(true);
    try {
      // Get viewer token
      const tokenData = await getAgoraToken(streamId, "viewer");

      // Join channel
      await clientRef.current.join(
        "9476d1c9b94d48f3a6f312798aa6c3a6",
        tokenData.channelName,
        tokenData.token,
        null
      );

      const stream = streams.find((s) => s.id === streamId);
      setActiveStream(stream || null);
      toast.success("Joined stream as viewer");
    } catch (error: any) {
      console.error("Error joining stream:", error);
      toast.error(error.message || "Failed to join stream");
    } finally {
      setIsLoading(false);
    }
  };

  // Leave viewer stream
  const leaveViewerStream = async () => {
    try {
      await clientRef.current.leave();
      setActiveStream(null);
      setRemoteUsers(new Set());
      toast.success("Left the stream");
    } catch (error) {
      console.error("Error leaving stream:", error);
      toast.error("Failed to leave stream");
    }
  };

  // Toggle video
  const toggleVideo = () => {
    if (localVideoTrack) {
      if (isVideoEnabled) {
        localVideoTrack.setEnabled(false);
      } else {
        localVideoTrack.setEnabled(true);
      }
      setIsVideoEnabled(!isVideoEnabled);
    }
  };

  // Toggle audio
  const toggleAudio = () => {
    if (localAudioTrack) {
      if (isAudioEnabled) {
        localAudioTrack.setEnabled(false);
      } else {
        localAudioTrack.setEnabled(true);
      }
      setIsAudioEnabled(!isAudioEnabled);
    }
  };

  // Send chat message
  const sendMessage = () => {
    if (message.trim()) {
      const newMessage = {
        user: "You",
        message: message.trim(),
        time: new Date().toLocaleTimeString(),
      };
      setChatMessages((prev) => [...prev, newMessage]);
      setMessage("");
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Check if user is the streamer
  const isUserStreamer = (stream: Stream) => {
    if (!currentUserId) return false;
    return stream.streamer.id === currentUserId;
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Live Streaming</h1>
          <p className="text-gray-500">Go live instantly with one click</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            onClick={() => fetchStreams()}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              "Refresh"
            )}
          </Button>

          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Create Stream
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Stream</DialogTitle>
                <DialogDescription>
                  Create a stream to go live
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Stream Title *</Label>
                  <Input
                    id="title"
                    placeholder="Enter stream title"
                    value={newStreamTitle}
                    onChange={(e) => setNewStreamTitle(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    placeholder="Enter stream description"
                    value={newStreamDescription}
                    onChange={(e) => setNewStreamDescription(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setShowCreateDialog(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={createLiveStream}
                  disabled={isCreatingStream || !newStreamTitle.trim()}
                >
                  {isCreatingStream ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    "Create Stream"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Button
            onClick={handleQuickStart}
            disabled={isLoading || isBroadcasting}
            className="bg-red-600 hover:bg-red-700"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Play className="w-4 h-4 mr-2" />
            )}
            Go Live Now
          </Button>
        </div>
      </div>

      {isBroadcasting && (
        <div className="mb-6">
          <Card className="border-red-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse mr-3"></div>
                  <span className="font-bold">You are live!</span>
                </div>
                <Button
                  variant="destructive"
                  onClick={stopBroadcast}
                  disabled={isLoading}
                >
                  <Square className="w-4 h-4 mr-2" />
                  End Stream
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs defaultValue="streams" className="space-y-4">
        <TabsList>
          <TabsTrigger value="streams">
            <Video className="w-4 h-4 mr-2" />
            Live Streams
          </TabsTrigger>
          {activeStream && (
            <TabsTrigger value="broadcast">
              {isBroadcasting ? (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Broadcasting
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4 mr-2" />
                  Watching
                </>
              )}
            </TabsTrigger>
          )}
          <TabsTrigger value="my-streams">
            <User className="w-4 h-4 mr-2" />
            My Streams
          </TabsTrigger>
        </TabsList>

        {/* All Streams Tab */}
        <TabsContent value="streams">
          {streams.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <Video className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium mb-2">No live streams</h3>
                <p className="text-gray-500 mb-4">Be the first to go live!</p>
                <Button onClick={handleQuickStart}>
                  <Play className="w-4 h-4 mr-2" />
                  Start Your First Stream
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {streams.map((stream) => (
                <Card
                  key={stream.id}
                  className="overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg line-clamp-1">
                        {stream.title}
                      </CardTitle>
                      <Badge
                        variant={
                          stream.isLive
                            ? "destructive"
                            : stream.streamStatus === "scheduled"
                            ? "secondary"
                            : "outline"
                        }
                      >
                        {stream.isLive
                          ? "LIVE"
                          : stream.streamStatus.toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-500 line-clamp-2">
                      {stream.description || "No description"}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center text-sm">
                        <User className="w-4 h-4 mr-2 text-gray-500" />
                        <span className="font-medium">
                          {stream.streamer.name}
                        </span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Users className="w-4 h-4 mr-2 text-gray-500" />
                        <span>{stream.currentViewers} viewers</span>
                      </div>
                      {stream.liveStartedAt && (
                        <div className="flex items-center text-sm">
                          <Clock className="w-4 h-4 mr-2 text-gray-500" />
                          <span>
                            Started: {formatDate(stream.liveStartedAt)}
                          </span>
                        </div>
                      )}
                      <div className="flex gap-2 mt-4">
                        {isUserStreamer(stream) ? (
                          <>
                            {stream.isLive ? (
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={stopBroadcast}
                                disabled={isLoading}
                              >
                                <Square className="w-4 h-4 mr-2" />
                                End Stream
                              </Button>
                            ) : (
                              <Button
                                size="sm"
                                onClick={() =>
                                  startExistingBroadcast(stream.id)
                                }
                                disabled={
                                  isLoading ||
                                  stream.streamStatus === "ended" ||
                                  stream.streamStatus === "cancelled"
                                }
                              >
                                <Play className="w-4 h-4 mr-2" />
                                Go Live
                              </Button>
                            )}
                          </>
                        ) : (
                          <>
                            {stream.isLive ? (
                              <Button
                                size="sm"
                                onClick={() => joinAsViewer(stream.id)}
                                disabled={isLoading}
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                Watch Live
                              </Button>
                            ) : (
                              <Button size="sm" variant="outline" disabled>
                                <Clock className="w-4 h-4 mr-2" />
                                {stream.streamStatus === "scheduled"
                                  ? "Scheduled"
                                  : "Ended"}
                              </Button>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Broadcast/Watching Tab */}
        {activeStream && (
          <TabsContent value="broadcast">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Video Section */}
              <div className="lg:col-span-2 space-y-4">
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle>{activeStream.title}</CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={isBroadcasting ? "destructive" : "secondary"}
                        >
                          {isBroadcasting ? "LIVE" : "WATCHING"}
                        </Badge>
                        <Badge variant="outline">
                          <Users className="w-3 h-3 mr-1" />
                          {remoteUsers.size + (isBroadcasting ? 1 : 0)} online
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
                      {/* Remote Video */}
                      <div
                        ref={remoteVideoContainerRef}
                        className="w-full h-full"
                      />

                      {/* Local Video (Picture-in-Picture) */}
                      {isBroadcasting && (
                        <div className="absolute bottom-4 right-4 w-48 h-32 rounded-lg overflow-hidden border-2 border-white">
                          <div
                            ref={localVideoContainerRef}
                            className="w-full h-full"
                          />
                        </div>
                      )}

                      {/* Controls Overlay */}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                        <div className="flex justify-center gap-4">
                          {isBroadcasting ? (
                            <>
                              <Button
                                size="icon"
                                variant={
                                  isVideoEnabled ? "secondary" : "destructive"
                                }
                                onClick={toggleVideo}
                                className="rounded-full"
                              >
                                {isVideoEnabled ? <Video /> : <EyeOff />}
                              </Button>
                              <Button
                                size="icon"
                                variant={
                                  isAudioEnabled ? "secondary" : "destructive"
                                }
                                onClick={toggleAudio}
                                className="rounded-full"
                              >
                                {isAudioEnabled ? <Mic /> : <MicOff />}
                              </Button>
                              <Button
                                size="icon"
                                variant="destructive"
                                onClick={stopBroadcast}
                                className="rounded-full"
                              >
                                <Square />
                              </Button>
                            </>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={leaveViewerStream}
                            >
                              Leave Stream
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Stream Info */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Stream Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm text-gray-500">Status</Label>
                        <p className="font-medium">
                          {activeStream.streamStatus}
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm text-gray-500">Viewers</Label>
                        <p className="font-medium">
                          {activeStream.currentViewers} /{" "}
                          {activeStream.maxViewers}
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm text-gray-500">Type</Label>
                        <p className="font-medium capitalize">
                          {activeStream.streamType}
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm text-gray-500">Started</Label>
                        <p className="font-medium">
                          {formatDate(activeStream.liveStartedAt || "")}
                        </p>
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm text-gray-500">
                        Description
                      </Label>
                      <p className="mt-1">
                        {activeStream.description || "No description"}
                      </p>
                    </div>
                    <div className="pt-4 border-t">
                      <Label className="text-sm text-gray-500 mb-2 block">
                        Streamer
                      </Label>
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                          <User className="w-5 h-5 text-gray-500" />
                        </div>
                        <div>
                          <p className="font-medium">
                            {activeStream.streamer.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {activeStream.streamer.email}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Chat Section */}
              <div className="space-y-4">
                <Card className="h-[500px] flex flex-col">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg">Live Chat</CardTitle>
                      <Badge variant="outline">
                        <Users className="w-3 h-3 mr-1" />
                        {chatMessages.length}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1 overflow-hidden flex flex-col">
                    {/* Chat Messages */}
                    <div className="flex-1 overflow-y-auto space-y-3 mb-4 pr-2">
                      {chatMessages.map((msg, index) => (
                        <div key={index} className="p-3 bg-gray-50 rounded-lg">
                          <div className="flex justify-between mb-1">
                            <span className="font-medium text-sm">
                              {msg.user}
                            </span>
                            <span className="text-xs text-gray-500">
                              {msg.time}
                            </span>
                          </div>
                          <p className="text-sm">{msg.message}</p>
                        </div>
                      ))}
                      {chatMessages.length === 0 && (
                        <div className="text-center text-gray-500 py-8">
                          <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-50" />
                          <p>No messages yet</p>
                          <p className="text-sm">Be the first to chat!</p>
                        </div>
                      )}
                    </div>

                    {/* Chat Input */}
                    <div className="border-t pt-4">
                      <div className="flex gap-2">
                        <Input
                          placeholder="Type your message..."
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                          disabled={!isChatEnabled}
                          className="flex-1"
                        />
                        <Button
                          onClick={sendMessage}
                          disabled={!message.trim() || !isChatEnabled}
                        >
                          Send
                        </Button>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <Label className="flex items-center text-sm cursor-pointer">
                          <input
                            type="checkbox"
                            checked={isChatEnabled}
                            onChange={() => setIsChatEnabled(!isChatEnabled)}
                            className="mr-2"
                          />
                          Enable Chat
                        </Label>
                        <span className="text-xs text-gray-500">
                          {chatMessages.length} messages
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Viewer List */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Viewers</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {Array.from(remoteUsers).map((uid) => (
                        <div
                          key={uid}
                          className="flex items-center p-2 hover:bg-gray-50 rounded"
                        >
                          <User className="w-4 h-4 mr-2 text-gray-500" />
                          <span>Viewer {uid}</span>
                        </div>
                      ))}
                      {remoteUsers.size === 0 && (
                        <div className="text-center py-4">
                          <Users className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                          <p className="text-gray-500">No viewers yet</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        )}

        {/* My Streams Tab */}
        <TabsContent value="my-streams">
          <Card>
            <CardHeader>
              <CardTitle>My Streams</CardTitle>
              <p className="text-gray-500">Manage your live streams</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {streams
                    .filter((stream) => isUserStreamer(stream))
                    .map((stream) => (
                      <Card key={stream.id}>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-medium line-clamp-1">
                              {stream.title}
                            </h3>
                            <Badge
                              variant={
                                stream.isLive
                                  ? "destructive"
                                  : stream.streamStatus === "scheduled"
                                  ? "secondary"
                                  : "outline"
                              }
                            >
                              {stream.isLive
                                ? "LIVE"
                                : stream.streamStatus.toUpperCase()}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                            {stream.description || "No description"}
                          </p>
                          <div className="flex justify-between items-center">
                            <div className="text-sm">
                              <div className="flex items-center">
                                <Users className="w-3 h-3 mr-1" />
                                {stream.currentViewers} viewers
                              </div>
                            </div>
                            <div className="flex gap-2">
                              {stream.isLive ? (
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={stopBroadcast}
                                  disabled={isLoading}
                                >
                                  End
                                </Button>
                              ) : (
                                <Button
                                  size="sm"
                                  onClick={() =>
                                    startExistingBroadcast(stream.id)
                                  }
                                  disabled={
                                    isLoading ||
                                    stream.streamStatus === "ended" ||
                                    stream.streamStatus === "cancelled"
                                  }
                                >
                                  Go Live
                                </Button>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>

                {streams.filter((stream) => isUserStreamer(stream)).length ===
                  0 && (
                  <div className="text-center py-8">
                    <Video className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium mb-2">No streams yet</h3>
                    <p className="text-gray-500 mb-4">
                      Create your first stream to get started
                    </p>
                    <Button onClick={() => setShowCreateDialog(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Create First Stream
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Live;
