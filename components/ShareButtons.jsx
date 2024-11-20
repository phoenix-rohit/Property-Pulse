import {
  FacebookIcon,
  WhatsappIcon,
  EmailIcon,
  TwitterIcon,
  FacebookShareButton,
  WhatsappShareButton,
  EmailShareButton,
  TwitterShareButton,
} from "react-share";

function ShareButtons({ property }) {
  const shareUrl = `${process.env.NEXT_PUBLIC_DOMAIN}/properties/${property._id}`;

  return (
    <>
      <h3 className="pt-2 text-xl font-bold text-center">
        Share This Property:
      </h3>
      <div className="flex justify-center gap-3 pb-5">
        <FacebookShareButton
          url={shareUrl}
          quote={property.name}
          hashtag={`#${property.type.replace(/\s/g, "")}ForRent`}
        >
          <FacebookIcon size={40} round={true} />
        </FacebookShareButton>
        <TwitterShareButton
          url={shareUrl}
          title={property.name}
          hashtags={[`${property.type.replace(/\s/g, "")}ForRent`]}
        >
          <TwitterIcon size={40} round={true} />
        </TwitterShareButton>
        <WhatsappShareButton
          url={shareUrl}
          title={property.name}
          separator=":: "
        >
          <WhatsappIcon size={40} round={true} />
        </WhatsappShareButton>
        <EmailShareButton
          url={shareUrl}
          subject={property.name}
          body={`Check out this property listing : ${shareUrl}`}
        >
          <EmailIcon size={40} round={true} />
        </EmailShareButton>
      </div>
    </>
  );
}

export default ShareButtons;
