'use client';

import { useState } from 'react';

import Image from 'next/image';

import cx from 'classnames';

interface UserAvatarProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  avatar?: string;
  alt: string;
  isOnline?: boolean;
}

export default function UserAvatar({ size = 'sm', avatar, alt, isOnline = true }: Readonly<UserAvatarProps>) {
  // useState
  const [isError, setIsError] = useState<boolean>(!avatar);

  return (
    <div className={cx('avatar', isOnline && 'avatar-online', !avatar && 'avatar-placeholder')}>
      <div
        className={cx('bg-neutral text-neutral-content rounded-full', {
          'w-12': size === 'sm',
          'w-36': size === 'md',
          'w-48': size === 'lg',
          'w-72': size === 'xl',
        })}
      >
        {isError ? (
          <div className="flex size-full items-center justify-center select-none">
            <span className="text-3xl">{alt.substring(0, 1).toUpperCase()}</span>
          </div>
        ) : (
          <Image
            className="rounded-full"
            src={avatar || ''}
            alt={alt}
            fill
            onError={() => {
              setIsError(true);
            }}
          />
        )}
      </div>
    </div>
  );
}
