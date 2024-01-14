import { IconType } from 'react-icons';

interface SocialMediaLinksProps {
  name: string;
  value: string;
  Icon: IconType;
  setSocials: React.Dispatch<
    React.SetStateAction<{
      instagram: string;
      x: string;
      youtube: string;
    }>
  >;
}

const SocialMediaLinks = ({
  name,
  value,
  setSocials,
  Icon,
}: SocialMediaLinksProps) => {
  const handleSocialMedia = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSocials((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  return (
    <label className="social_media">
      <Icon size={25} />
      <input
        type="url"
        value={value}
        onChange={handleSocialMedia}
        name={name}
      />
    </label>
  );
};

export default SocialMediaLinks;
