'use client';

import { CgProfile } from 'react-icons/cg';
import { FiMenu } from 'react-icons/fi';
import { IoLogOutOutline } from 'react-icons/io5';

import Link from 'next/link';

import UserAvatar from '@/domain/user/components/UserAvatar';

export default function Header() {
  return (
    <header className="m-2 flex w-full flex-row items-center justify-between gap-3 rounded-2xl border border-gray-300 bg-white p-3 shadow-lg backdrop-blur">
      {/* content */}
      <div className="">
        <div className="flex flex-row items-center justify-between">
          {/* menu button */}
          <button className="btn btn-circle btn-ghost">
            <FiMenu className="h-6 w-6" />
          </button>

          {/* logo */}
          <Link className="btn btn-ghost" href="/">
            <h2 className="text-2xl font-bold text-sky-600 select-none">CMS STT</h2>
          </Link>
        </div>
      </div>

      <div className="flex flex-row items-center justify-center gap-3 pr-10">
        {/* team + position */}
        <div className="hidden text-lg select-none md:block">
          <span className="mr-3 text-gray-600">
            <span className="font-semibold">user</span>
          </span>
          <span className="font-bold">user</span>
        </div>

        {/* avatar */}
        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="m-1">
            <UserAvatar alt="user" />
          </div>
          <ul tabIndex={0} className="menu dropdown-content rounded-box bg-base-100 z-[1] w-40 p-2 shadow">
            <li>
              <Link href="/profile">
                <CgProfile className="h-3 w-3" />
                프로필
              </Link>
            </li>
            <li>
              <a href="/logout">
                <IoLogOutOutline className="h-3 w-3" />
                로그아웃
              </a>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
}
