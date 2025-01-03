import React from 'react';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '../../components/ui/avatar';

type AvatarProps = {
  src?: string;
  alt: string;
};

const AmlAvatar = ({ src, alt }: AvatarProps) => (
  <Avatar>
    <AvatarImage src={src} />
    <AvatarFallback>{alt}</AvatarFallback>
  </Avatar>
);

export default AmlAvatar;
