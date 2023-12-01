'use client';

import { useSession } from "../context-hooks/session/SessionUtils";
import AdminSidebar from "./AdminSidebar";

function SideBar() {
    const data = useSession()

    const Navs = {
        5: <AdminSidebar />
    }

    return Navs[data ? data.typeID : 1] || ''
}

export default SideBar