import PropTypes from "prop-types"
import { Tabs, TabList, TabPanel, Tab } from "react-tabs"

function UsersTicketTab({ borrowed, reserved, overdue, others, counts }) {
    return (
        <Tabs
            selectedTabClassName='bg-primary-400 text-white'
            selectedTabPanelClassName='bg-inherit'
            className='w-full h-full'
        >
            <TabList className='flex flex-row w-full cursor-pointer font-semibold'>
                <Tab className='rounded-ss-md p-3 text-lg bg-gray-800 text-gray-400 hover:bg-primary-600 hover:text-white transition-all duration-100'>
                    RESERVED <span className="font-normal">({counts['reserved']})</span>
                </Tab>
                <Tab className=' p-3 text-lg bg-gray-800 text-gray-400 hover:bg-primary-600 hover:text-white transition-all duration-100'>
                    BORROWED <span className="font-normal">({counts['borrowed']})</span>
                </Tab>
                <Tab className={`${counts['overdue']>0? 'bg-red-600 hover:bg-red-800 text-white': 'bg-gray-800 hover:bg-primary-600'} p-3 text-lg text-gray-400 hover:text-white transition-all duration-100`}>
                    OVERDUE <span className="font-normal">({counts['overdue']})</span>
                </Tab>
                <Tab className='rounded-se-md p-3 text-lg bg-gray-800 text-gray-400 hover:bg-primary-600 hover:text-white transition-all duration-100'>
                    OTHERS <span className="font-normal">({counts['others']})</span>
                </Tab>
            </TabList>

            <div className='h-full shadow-lg p-5 bg-secondary-100 rounded-md rounded-tl-none'>
                <TabPanel className='flex flex-col gap-5'>
                    {reserved}
                </TabPanel>
                <TabPanel>
                    {borrowed}
                </TabPanel>
                <TabPanel>
                    {overdue}
                </TabPanel>
                <TabPanel>
                    {others}
                </TabPanel>
            </div>
        </Tabs>
    )
}

UsersTicketTab.propTypes = {
    borrowed: PropTypes.any,
    counts: PropTypes.any,
    others: PropTypes.any,
    overdue: PropTypes.any,
    reserved: PropTypes.any
}

export default UsersTicketTab