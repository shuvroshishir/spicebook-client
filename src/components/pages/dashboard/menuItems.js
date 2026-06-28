import {
    House,
    BookOpen,
    CirclePlus,
    Heart,
    ShoppingBag,
    Person,
} from "@gravity-ui/icons";

const menuItems = [
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

export default menuItems;