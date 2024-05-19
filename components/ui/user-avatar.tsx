import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface Props {
  nom: string | null;
  prenom: string | null;

}

export const UserAvatar = ({ nom, prenom }: Props) => {
  const initials = (nom || '')
    .charAt(0)
    .toUpperCase() +
    (prenom || '')
    .charAt(0)
    .toUpperCase();

  return (
    <Avatar >
      <AvatarFallback className='text-3xl'>{initials}</AvatarFallback>
    </Avatar>
  );
};
