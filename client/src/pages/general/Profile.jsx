"use client";

import UpdateUserForm from '../../components/forms/update/UpdateUserForm'
import { useSession } from '../../components/context-hooks/session/SessionUtils'
import UpdatePasswordForm from '../../components/forms/update/UpdatePasswordForm'
import { useState } from 'react'

function Profile() {
    const session = useSession()
    const [activeTab, setActiveTab] = useState('user info');

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };
    return (
        <>
            <div className='flex flex-row lg:flex-row py-5 px-10 gap-10 xl:px-20 h-max'>
                <div className='h-max bg-secondary-100 flex flex-col w-full md:w-1/2 xl:w-1/5 gap-1 md:self-center lg:self-auto flex-shrink-0 shadow-lg rounded-md'>
                    <div className='bg-secondary-400 p-3 text-lg text-white text-center font-semibold rounded-t-md'>
                        OPTIONS
                    </div>
                    <div className='p-5 w-full flex flex-col gap-5 justify-left'>
                        <button onClick={() => handleTabChange('user info')} className={`hover:text-text-600 ${activeTab === 'user info' ? ' text-text-500' : 'text-text-800'}`} disabled=''>
                            User Information
                        </button>
                        <button onClick={() => handleTabChange('change pass')} className={`hover:text-text-600 ${activeTab === 'change pass' ? ' text-text-500' : 'text-text-800'}`}>
                            Change Password
                        </button>
                    </div>
                </div>
                <div className='flex flex-col min-w-[500px]'>
                    <div className='bg-secondary-400 p-3 text-lg text-white text-center font-semibold rounded-t-md'>
                        {activeTab.toUpperCase()}
                    </div>
                    <div className='w-full p-5 bg-secondary-100 rounded-md'>
                        {activeTab === 'user info' && (
                            <UpdateUserForm user={session} profile />
                        )}
                        {activeTab === 'change pass' && (
                            <UpdatePasswordForm />
                        )}
                    </div>
                </div>

            </div>
        </>
    )
}

export default Profile