import {
    House,
    BookOpen,
    CirclePlus,
    Heart,
    ShoppingBag,
    Person,
} from "@gravity-ui/icons";
import { LuUsers, LuTriangleAlert, LuReceipt } from "react-icons/lu";

export const userMenuItems = [
    {
        label: "Overview",
        href: "/dashboard",
        icon: House,
    },
    {
        label: "Profile",
        href: "/dashboard/profile",
        icon: Person,
    },
    {
        label: "My Recipes",
        href: "/dashboard/my-recipes",
        icon: BookOpen,
    },
    {
        label: "Add Recipe",
        href: "/dashboard/add-recipe",
        icon: CirclePlus,
        badge: "Pro",
    },
    {
        label: "My Favorites",
        href: "/dashboard/my-favorites",
        icon: Heart,
    },
    {
        label: "Purchased Recipes",
        href: "/dashboard/purchased-recipes",
        icon: ShoppingBag,
    },
];

export const adminMenuItems = [
    {
        label: "Overview",
        href: "/dashboard",
        icon: House,
    },
    {
        label: "Manage Users",
        href: "/dashboard/manage-users",
        icon: LuUsers,
    },
    {
        label: "Manage Recipes",
        href: "/dashboard/manage-recipes",
        icon: BookOpen,
    },
    {
        label: "Recipe Reports",
        href: "/dashboard/reports",
        icon: LuTriangleAlert,
    },
    {
        label: "Transactions",
        href: "/dashboard/transactions",
        icon: LuReceipt,
    },
    {
        label: "Profile",
        href: "/dashboard/profile",
        icon: Person,
    },
];