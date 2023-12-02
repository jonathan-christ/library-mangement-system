"use client"

import axios from 'axios'

import { FaCircle } from "react-icons/fa"
import { IoNotifications } from "react-icons/io5"
import { Dropdown } from "flowbite-react"
import { useState, useEffect } from "react"
import { useSession } from "../../context-hooks/session/SessionUtils"
import { toast } from 'react-toastify'
import { dateFormat } from './../../../assets/formatter'

function UserNotifications() {
  const [hasUnread, setHasUnread] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const user = useSession();

  useEffect(() => {
    getNotifs()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const getNotifs = async () => {
    try {
      const response = await axios.post("/api/notifications/find", { userID: user.id })
      setNotifications(response.data);
      setHasUnread(response.data.some(notification => !notification.isRead))
    } catch (error) {
      console.error("Error fetching notifications:", error)
    }
  }

  const readNotifs = async (notifID) => {
    try {
      await axios.put("/api/notifications/update", { userID: user.id, id: notifID })
      console.log("Notification marked as read.");
      getNotifs(); // Assuming getNotifs is a function that fetches notifications
    } catch (error) {
      console.error("Error marking notification as read:", error)
    }
  }

  const notifCells = notifications?.map(notif => {
    if (!notif.isRead) {
      toast.info(notif.text, {
        position: "bottom-right",
        toastId: notif.id
      })
    }
    return (
      <Dropdown.Item key={notif.id} onClick={() => notif.isRead ? '' : readNotifs(notif.id)}
        className={`flex gap-4 text-left align-middle border-b`}
      >
        {notif.isRead || <FaCircle size={8} color='blue' className='flex-shrink-0' />}
        <div className='flex flex-col'>
          {notif.text}
          <span className='text-xs pt-2 text-gray-500'>
            {dateFormat(notif.sendDate)}
          </span>
        </div>
      </Dropdown.Item>
    )
  })

  return (
    <Dropdown
      arrowIcon={false}
      inline
      label={
        <div className="relative">
          <IoNotifications size={18} className={`hover:text-blue-600`} />
          {!hasUnread || <FaCircle className="absolute top-0 right-0 text-blue-500" size={8} />}
        </div>
      }
      onClick={() => getNotifs()}
      className='w-full md:w-1/2 lg:w-1/3'
    >
      <Dropdown.Header className='border-b-1'>
        <span className="block text-sm font-semibold text-gray-900 dark:text-white">Notifications</span>
      </Dropdown.Header>
      {notifCells.length == 0 ?
        <div className='px-5'>
          <span className='text-sm'>Looks empty down here!</span>
        </div>
        :
        notifCells
      }
    </Dropdown>
  )
}

export default UserNotifications