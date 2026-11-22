import {Check, Globe, LogoGithub, Moon, Sun} from "@gravity-ui/icons";
import {Button, Dropdown, Label} from "@heroui/react";
import {buttonVariants} from "@heroui/styles";
import type {ComponentPropsWithoutRef, ReactNode} from "react";
import {Link, RouterProvider} from "react-aria-components";

type Theme = "light" | "dark";
type LocaleLink = {locale: string; label: string; href: string};
const controlIcon = {"aria-hidden": true, focusable: false, width: 18, height: 18, style: {width: 18, height: 18, margin: 0}} as const;

export type ProductHeaderProps = {
  brand: {name: string; href: string; symbol: ReactNode; onClick?: ComponentPropsWithoutRef<"a">["onClick"]};
  theme: Theme;
  onToggleTheme: () => void;
  locale: string;
  locales: readonly LocaleLink[];
  onNavigateLocale?: (href: string) => void;
  githubHref: string;
  signIn?: {href: string; label: string};
  labels: {light: string; dark: string; language: string; github: string};
  variant?: "site" | "app";
  children?: ReactNode;
} & Pick<ComponentPropsWithoutRef<"header">, "id" | "className">;

export function ProjectBrand({name, href, symbol, onClick}: ProductHeaderProps["brand"]) {
  return <a className="niltavi-project-brand" href={href} aria-label={name} onClick={onClick}>
    <span className="niltavi-project-brand__symbol" aria-hidden="true">{symbol}</span>
    <span className="niltavi-project-brand__name">{name}</span>
  </a>;
}

function LanguageControl({locale, locales, onNavigateLocale, label}: Pick<ProductHeaderProps, "locale" | "locales" | "onNavigateLocale"> & {label: string}) {
  const dropdown = <Dropdown>
    <Button className="niltavi-product-header__control" isIconOnly size="sm" variant="ghost" aria-label={label}>
      <Globe {...controlIcon} />
    </Button>
    <Dropdown.Popover placement="bottom end">
      <Dropdown.Menu aria-label={label}>
        {locales.map((item) => <Dropdown.Item key={item.locale} id={item.locale} href={item.href} textValue={item.label}>
          <Label lang={item.locale}><span aria-current={item.locale === locale ? "true" : undefined}>{item.label}</span></Label>
          {item.locale === locale && <Check aria-hidden="true" focusable="false" width={16} height={16} />}
        </Dropdown.Item>)}
      </Dropdown.Menu>
    </Dropdown.Popover>
  </Dropdown>;

  return onNavigateLocale ? <RouterProvider navigate={onNavigateLocale}>{dropdown}</RouterProvider> : dropdown;
}

export function ProductHeader({brand, theme, onToggleTheme, locale, locales, onNavigateLocale, githubHref, signIn, labels, variant = "site", children, id, className}: ProductHeaderProps) {
  const ThemeIcon = theme === "light" ? Moon : Sun;
  const innerClass = variant === "site" ? "niltavi-product-header__inner niltavi-container" : "niltavi-product-header__inner niltavi-product-header__inner--full";

  return <header id={id} className={className ? `niltavi-product-header ${className}` : "niltavi-product-header"}>
    <div className={innerClass}>
      <ProjectBrand {...brand} />
      {children}
      <div className="niltavi-product-header__actions">
        {signIn && <Link className={buttonVariants({size: "sm", variant: "secondary"})} href={signIn.href}>{signIn.label}</Link>}
        <div className="niltavi-product-header__controls">
          <Button className="niltavi-product-header__control" isIconOnly size="sm" variant="ghost" aria-label={theme === "light" ? labels.dark : labels.light} onPress={onToggleTheme}>
            <ThemeIcon {...controlIcon} />
          </Button>
          <LanguageControl locale={locale} locales={locales} label={labels.language} {...(onNavigateLocale ? {onNavigateLocale} : {})} />
          <Link className={`${buttonVariants({isIconOnly: true, size: "sm", variant: "ghost"})} niltavi-product-header__control`} href={githubHref} aria-label={labels.github}>
            <LogoGithub {...controlIcon} />
          </Link>
        </div>
      </div>
    </div>
  </header>;
}

export function ProductFooter({lightLogo, darkLogo}: {lightLogo: string; darkLogo: string}) {
  return <footer className="niltavi-product-footer niltavi-container">
    <a href="https://niltavi.com/" aria-label="Niltavi">
      <img className="niltavi-product-footer__light" src={lightLogo} alt="" width={75} height={28} />
      <img className="niltavi-product-footer__dark" src={darkLogo} alt="" width={75} height={28} />
    </a>
  </footer>;
}
