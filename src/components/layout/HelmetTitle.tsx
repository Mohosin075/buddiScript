import { Helmet } from "react-helmet-async";

type HelmetTitleProps = {
  title?: string;
  description?: string;
};

const HelmetTitle = ({
  title = "buddiScript",
  description = "buddiScript is a digital content sharing platform",
}: HelmetTitleProps) => {
  return (
    <Helmet>
      <title>{title ? `${title} - buddiScript` : "buddiScript"}</title>
      <meta name="description" content={description} />
    </Helmet>
  );
};

export default HelmetTitle;
