// Icon.tsx - Unified Icon Component for Heroicons & Lucide
import React from "react";
import { type LucideProps } from "lucide-react";
import * as HeroIconsOutline from "@heroicons/react/24/outline";
import * as HeroIconsSolid from "@heroicons/react/24/solid";
import * as HeroIconsMini from "@heroicons/react/20/solid";
import * as LucideIcons from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils"; // clsx + tailwind-merge

// ============================================================================
// TYPES
// ============================================================================

// Icon library types
type HeroOutlineIcon = keyof typeof HeroIconsOutline;
type HeroSolidIcon = keyof typeof HeroIconsSolid;
type HeroMiniIcon = keyof typeof HeroIconsMini;
type LucideIcon = keyof typeof LucideIcons;

// Icon variant styles using CVA
const iconVariants = cva("inline-flex shrink-0", {
  variants: {
    size: {
      xs: "h-3 w-3",
      sm: "h-4 w-4",
      md: "h-5 w-5",
      lg: "h-6 w-6",
      xl: "h-8 w-8",
      "2xl": "h-10 w-10",
    },
    variant: {
      default: "",
      primary: "text-primary",
      secondary: "text-secondary",
      success: "text-green-600",
      warning: "text-yellow-600",
      danger: "text-red-600",
      muted: "text-muted-foreground",
    },
  },
  defaultVariants: {
    size: "md",
    variant: "default",
  },
});

// Base icon props
interface BaseIconProps extends VariantProps<typeof iconVariants> {
  className?: string;
  strokeWidth?: number;
  "aria-hidden"?: boolean;
  "aria-label"?: string;
}

// Heroicons specific props
interface HeroIconProps extends BaseIconProps {
  library: "heroicons";
  name: HeroOutlineIcon | HeroSolidIcon | HeroMiniIcon;
  style?: "outline" | "solid" | "mini";
}

// Lucide specific props
interface LucideIconProps extends BaseIconProps, Omit<LucideProps, "ref"> {
  library: "lucide";
  name: LucideIcon;
}

// Union type for all icon props
type IconProps = HeroIconProps | LucideIconProps;

// ============================================================================
// TYPE GUARDS
// ============================================================================

function isHeroIcon(props: IconProps): props is HeroIconProps {
  return props.library === "heroicons";
}

function isLucideIcon(props: IconProps): props is LucideIconProps {
  return props.library === "lucide";
}

// ============================================================================
// HELPERS
// ============================================================================

// Helper to get Heroicons component
function getHeroIcon(
  name: string,
  style: "outline" | "solid" | "mini" = "outline"
) {
  let iconSet: any;

  switch (style) {
    case "solid":
      iconSet = HeroIconsSolid;
      break;
    case "mini":
      iconSet = HeroIconsMini;
      break;
    default:
      iconSet = HeroIconsOutline;
  }

  return iconSet[name as keyof typeof iconSet];
}

// ============================================================================
// MAIN ICON COMPONENT
// ============================================================================

export const Icon = React.forwardRef<SVGSVGElement, IconProps>((props, ref) => {
  const { size, variant, className, ...restProps } = props;

  const iconClasses = cn(iconVariants({ size, variant }), className);

  if (isHeroIcon(props)) {
    const {
      name,
      style = "outline",
      strokeWidth = 1.5,
      ...heroProps
    } = restProps;
    const HeroComponent = getHeroIcon(name as string, style);

    if (!HeroComponent) {
      console.warn(`Icon "${name}" not found in Heroicons ${style}`);
      return null;
    }

    return (
      <HeroComponent
        ref={ref}
        className={iconClasses}
        strokeWidth={strokeWidth}
        {...heroProps}
      />
    );
  }

  if (isLucideIcon(props)) {
    const { name, strokeWidth = 2, ...lucideProps } = restProps;
    const LucideComponent = LucideIcons[name];

    if (!LucideComponent || typeof LucideComponent !== "function") {
      console.warn(`Icon "${name}" not found in Lucide`);
      return null;
    }

    return (
      <LucideComponent
        ref={ref}
        className={iconClasses}
        strokeWidth={strokeWidth}
        {...lucideProps}
      />
    );
  }

  return null;
});

Icon.displayName = "Icon";

// ============================================================================
// CONVENIENCE WRAPPER COMPONENTS
// ============================================================================

export const HeroIcon = React.forwardRef<
  SVGSVGElement,
  Omit<HeroIconProps, "library">
>((props, ref) => <Icon ref={ref} library="heroicons" {...props} />);

HeroIcon.displayName = "HeroIcon";

export const LucideIcon = React.forwardRef<
  SVGSVGElement,
  Omit<LucideIconProps, "library">
>((props, ref) => <Icon ref={ref} library="lucide" {...props} />);

LucideIcon.displayName = "LucideIcon";

// ============================================================================
// EXPORTS
// ============================================================================

export type { IconProps, HeroIconProps, LucideIconProps };
export { iconVariants };

{
  /* <Icon library="heroicons" name="HeartIcon" style="solid" size="xs" variant="success"  strokeWidth={2.5}
  className="hover:scale-110 transition-transform duration-200" aria-label="Close dialog"
  aria-hidden={false} /> */
}
