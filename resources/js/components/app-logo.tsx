import AppLogoIcon from './app-logo-icon';

export default function AppLogo({ restaurant }: { restaurant?: { name: string; logo: string | null } | null }) {
    if (restaurant) {
        return (
            <>
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-md overflow-hidden bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 shadow-sm">
                    {restaurant.logo ? (
                        <img 
                            src={restaurant.logo.startsWith('http') || restaurant.logo.startsWith('/storage') ? restaurant.logo : `/storage/${restaurant.logo}`} 
                            alt={restaurant.name} 
                            className="h-full w-full object-cover" 
                        />
                    ) : (
                        <AppLogoIcon className="size-5 fill-current text-white dark:text-black" />
                    )}
                </div>
                <div className="ml-1 grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate leading-none font-bold text-indigo-600 dark:text-indigo-400">{restaurant.name}</span>
                </div>
            </>
        );
    }

    return (
        <>
            <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-md">
                <AppLogoIcon className="size-5 fill-current text-white dark:text-black" />
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-none font-semibold">Laravel Starter Kit</span>
            </div>
        </>
    );
}
