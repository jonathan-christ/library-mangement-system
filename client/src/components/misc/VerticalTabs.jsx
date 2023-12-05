import { useState } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

function VerticalTabs() {
    const [tabIndex, setTabIndex] = useState(0);

    const handleTabChange = (index) => {
        setTabIndex(index);
    };

    return (
        <div>
            <Tabs
                selectedIndex={tabIndex}
                onSelect={handleTabChange}
                vertical
                className="vertical-tabs"
            >
                <TabList>
                    <Tab>User Information</Tab>
                    <Tab>Change Password</Tab>
                </TabList>

                <TabPanel>
                    <p>User Information Content</p>
                </TabPanel>
                <TabPanel>
                    <p>Change Password Content</p>
                </TabPanel>
            </Tabs>
        </div>
    );
}

export default VerticalTabs;