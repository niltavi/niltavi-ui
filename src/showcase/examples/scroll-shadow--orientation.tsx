// Adapted from HeroUI official demos (Apache-2.0); see ../NOTICE.md.
import {useCopy} from "../copy";
import {Card, ScrollShadow} from "@heroui/react";

const images = [
  "https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/docs/robot1.jpeg",
  "https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/docs/avocado.jpeg",
  "https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/docs/oranges.jpeg",
];

export default function Orientation() {
  const t = useCopy();
  const getRandomImage = (idx: number) => {
    return images[idx % images.length];
  };

  return (
    <div className="w-full sm:max-w-sm">
      <div className="mb-8 w-full">
        <h4 className="mb-2 text-sm font-semibold">{t("Vertical")}</h4>
        <Card className="w-full p-0">
          <ScrollShadow className="max-h-[240px] p-4" orientation="vertical">
            <div className="space-y-4">
              {Array.from({length: 10}).map((_, idx) => (
                <p key={`scroll-shadow-lorem-content-${idx}`}>
                  {t("Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam pulvinar risus non risus hendrerit venenatis. Pellentesque sit amet hendrerit risus, sed porttitor quam. Morbi accumsan cursus enim, sed ultricies sapien.")}</p>
              ))}
            </div>
          </ScrollShadow>
        </Card>
      </div>

      <div className="w-full">
        <h4 className="mb-2 text-sm font-semibold">{t("Horizontal")}</h4>
        <Card className="w-full p-0">
          <ScrollShadow className="p-4" orientation="horizontal">
            <div className="flex flex-row gap-4">
              {Array.from({length: 10}).map((_, idx) => (
                <Card
                  key={`scroll-shadow-lorem-cards-${idx}`}
                  className="flex min-w-[200px] flex-row gap-3 p-1"
                  variant="transparent"
                >
                  <img
                    alt={t("Lorem Card")}
                    className="aspect-square h-16 w-16 shrink-0 rounded-xl object-cover select-none sm:h-20 sm:w-20"
                    loading="lazy"
                    src={getRandomImage(idx)}
                  />
                  <div className="flex flex-1 flex-col justify-center gap-1">
                    <Card.Title className="text-sm">{t("Bridging the Future")}</Card.Title>
                    <Card.Description className="text-xs">{t("Today, 6:30 PM")}</Card.Description>
                  </div>
                </Card>
              ))}
            </div>
          </ScrollShadow>
        </Card>
      </div>
    </div>
  );
}
