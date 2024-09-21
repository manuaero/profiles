// src/ProfileCard.tsx

import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Stack,
  Box,
  Tooltip,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Profile } from './data';

interface ProfileCardProps {
  profile: Profile;
  onClick: () => void;
}

const StyledCard = styled(Card)(({ theme }) => ({
  cursor: 'pointer',
  transition: 'transform 0.2s',
  '&:hover': {
    transform: 'translateY(-4px)',
  },
}));

const StyledChip = styled(Chip)(({ theme }) => ({
  backdropFilter: 'blur(4px)',
  height: '24px', // Fixed height for chips
}));

const generateSubtlePastelColor = () => {
  const hue = Math.floor(Math.random() * 360);
  return `hsl(${hue}, 30%, 95%)`;
};

const ProfileCard: React.FC<ProfileCardProps> = ({ profile, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [visibleSkills, setVisibleSkills] = useState<string[]>([]);
  const skillsContainerRef = useRef<HTMLDivElement>(null);

  const gradientBackground = useMemo(() => {
    const color1 = generateSubtlePastelColor();
    const color2 = generateSubtlePastelColor();
    return `linear-gradient(135deg, ${color1}, ${color2})`;
  }, []);

  useEffect(() => {
    const updateVisibleSkills = () => {
      if (skillsContainerRef.current) {
        const containerWidth = skillsContainerRef.current.offsetWidth;
        let currentWidth = 0;
        const visible = [];
        for (const skill of profile.skills) {
          // Approximate width calculation (adjust as needed)
          const skillWidth = skill.length * 8 + 32; // 8px per character + 32px padding
          if (currentWidth + skillWidth <= containerWidth) {
            visible.push(skill);
            currentWidth += skillWidth + 8; // 8px for gap
          } else {
            break;
          }
        }
        setVisibleSkills(visible);
      }
    };

    updateVisibleSkills();
    window.addEventListener('resize', updateVisibleSkills);
    return () => window.removeEventListener('resize', updateVisibleSkills);
  }, [profile.skills]);

  return (
    <StyledCard
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      sx={{ background: gradientBackground, boxShadow: 'none' }}
    >
      <CardContent>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography variant="h5" component="div">
            {profile.name}
          </Typography>
        </Box>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          {profile.employer}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {profile.college}
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={2}>
          {profile.location}
        </Typography>
        <Box sx={{ maxWidth: '100%', overflowX: 'hidden', pb: 1 }} ref={skillsContainerRef}>
          <Stack
            direction="row"
            spacing={1}
            alignItems="flex-start"
            sx={{
              flexWrap: 'nowrap',
              gap: '8px',
              paddingBottom: '8px',
            }}
          >
            {visibleSkills.map((skill, index) => (
              <StyledChip key={index} label={skill} size="small" />
            ))}
            {visibleSkills.length < profile.skills.length && (
              <Tooltip title={profile.skills.slice(visibleSkills.length).join(', ')}>
                <StyledChip label={`+${profile.skills.length - visibleSkills.length}`} size="small" />
              </Tooltip>
            )}
          </Stack>
        </Box>
      </CardContent>
    </StyledCard>
  );
};

export default ProfileCard;
