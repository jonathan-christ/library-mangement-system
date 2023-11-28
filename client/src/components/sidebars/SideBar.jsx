'use client';

import { useSession } from "../context-hooks/session/SessionUtils";
import AdminSidebar from "./AdminSidebar";
import StaffSidebar from "./StaffSidebar";

function SideBar() {
    const data = useSession()

    const Navs = {
        4: <StaffSidebar />,
        5: <AdminSidebar />
    }

    return Navs[data ? data.typeID : 1] || ''
}

export default SideBar