import { Group, List } from '@mantine/core';
import { FiHome, FiBriefcase, FiUsers } from 'react-icons/fi';
import NavListItem from './NavListItem';

export default function NavDrawer() {
  return (
    <div className="w-[240px] border-r pt-[85px] fixed top-0 left-0 min-h-screen">
      <div className="w-full">
        <div className="w-full grid gap-1 px-2">
          {/* <NavListItem href="/" icon={<FiHome size="20px" />} text="Dashboard" />
          <NavListItem href="/jobs" icon={<FiBriefcase size="20px" />} text="Jobs" />
          <NavListItem href="/candidates" icon={<FiUsers size="20px" />} text="Candidates" /> */}
        </div>
      </div>
    </div>
  );
}
