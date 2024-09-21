// src/ProfileDetail.tsx

import React from 'react';
import { Typography, Chip, Stack } from '@mui/material';
import { Profile } from './data';

interface ProfileDetailProps {
  profile: Profile;
}

const ProfileDetail: React.FC<ProfileDetailProps> = ({ profile }) => {
  return (
    <div>
      <Typography variant="h4">{profile.name}</Typography>
      <Typography variant="h6" color="textSecondary">
        {profile.employer}
      </Typography>
      <Typography variant="body1">
        <strong>College:</strong> {profile.college}
      </Typography>
      <Typography variant="body1">
        <strong>Location:</strong> {profile.location}
      </Typography>
      <Typography variant="body2" paragraph>
        {profile.bio}
      </Typography>
      <div>
        <Typography variant="body2" color="textSecondary">
          Skills:
        </Typography>
        <Stack direction="row" spacing={1} marginTop={1}>
          {profile.skills.map((skill, index) => (
            <Chip key={index} label={skill} size="small" />
          ))}
        </Stack>
      </div>
    </div>
  );
};

export default ProfileDetail;
