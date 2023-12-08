const TableTheme = 
    {
    "base": "",
        "layout": {
        "table": {
            "base": "text-sm text-gray-700 dark:text-gray-400",
                "span": "font-semibold text-gray-900 dark:text-white"
        }
    },
    "pages": {
        "base": "xs:mt-0 mt-2 inline-flex items-center -space-x-px text-sm",
            "showIcon": "inline-flex",
                "previous": {
            "base": "ml-0 rounded-l-lg bg-primary-400 py-2 px-3 leading-tight text-white enabled:hover:bg-primary-800 enabled:hover:text-white dark:bg-gray-800 dark:text-gray-400 enabled:dark:hover:bg-gray-700 enabled:dark:hover:text-white",
                "icon": "h-4 w-4"
        },
        "next": {
            "base": "rounded-r-lg bg-primary-400 py-2 px-3 leading-tight text-white enabled:hover:bg-primary-800 enabled:hover:text-white dark:bg-gray-800 dark:text-gray-400 enabled:dark:hover:bg-gray-700 enabled:dark:hover:text-white",
                "icon": "h-4 w-4"
        },
        "selector": {
            "base": "w-12 bg-white py-2 leading-tight text-text-400 enabled:hover:bg-gray-100 enabled:hover:text-gray-700 dark:bg-gray-800 dark:text-gray-400 enabled:dark:hover:bg-gray-700 enabled:dark:hover:text-white",
                "active": "bg-primary-100 text-text-600 hover:bg-cyan-100 hover:text-cyan-700 dark:bg-gray-700 dark:text-white",
                    "disabled": "opacity-50 cursor-normal"
        }
    }
}

export default TableTheme