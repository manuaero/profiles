// src/App.tsx

import React, { useState, useEffect } from 'react';
import { profiles, Profile } from './data';
import {
  Container,
  TextField,
  Grid,
  Drawer,
  IconButton,
  InputAdornment,
  Button,
  Modal,
  Box,
  Typography,
  Slider,
  Autocomplete,
  Chip,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import TuneIcon from '@mui/icons-material/Tune';
import ProfileCard from './ProfileCard';
import ProfileDetail from './ProfileDetail';

function App() {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    experience: [0, 40],
    pay: [0, 300],
    minHoursWeek: [0, 50],
    languages: [] as string[],
  });

  const handleFilterChange = (filter: keyof typeof filters) => (
    event: Event | React.SyntheticEvent | null,
    newValue: number | number[] | string[]
  ) => {
    setFilters({ ...filters, [filter]: newValue });
  };

  const allLanguages = Array.from(new Set(profiles.flatMap(profile => profile.languages)));

  useEffect(() => {
    if (filters.languages.length === 0) {
      // Reset the filtered profiles when language selection is empty
      setSearchTerm('');
    }
  }, [filters.languages]);

  const filteredProfiles = profiles.filter((profile) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch = profile.name.toLowerCase().includes(term) ||
      profile.skills.some((skill) => skill.toLowerCase().includes(term));
    const matchesFilters = 
      profile.experience >= filters.experience[0] && profile.experience <= filters.experience[1] &&
      profile.pay >= filters.pay[0] && profile.pay <= filters.pay[1] &&
      profile.minHoursWeek >= filters.minHoursWeek[0] && profile.minHoursWeek <= filters.minHoursWeek[1] &&
      (filters.languages.length === 0 || filters.languages.every(lang => profile.languages.includes(lang)));
    return matchesSearch && matchesFilters;
  });

  return (
    <Container>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
        <TextField
          label="Search profiles"
          variant="outlined"
          fullWidth
          margin="normal"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            sx: {
              borderRadius: '28px',
              '& fieldset': {
                borderRadius: '28px',
              },
            },
          }}
        />
        <Button
          variant="contained"
          onClick={() => setIsFilterModalOpen(true)}
          startIcon={<TuneIcon />}
        >
          Filters
        </Button>
      </Box>

      <Grid container spacing={2}>
        {filteredProfiles.map((profile) => (
          <Grid item xs={12} sm={6} md={4} key={profile.id}>
            <ProfileCard
              profile={profile}
              onClick={() => setSelectedProfile(profile)}
            />
          </Grid>
        ))}
      </Grid>

      <Drawer
        anchor="right"
        open={Boolean(selectedProfile)}
        onClose={() => setSelectedProfile(null)}
      >
        <div style={{ width: 350, padding: 16 }}>
          <IconButton
            onClick={() => setSelectedProfile(null)}
            style={{ float: 'right' }}
          >
            <CloseIcon />
          </IconButton>
          {selectedProfile && <ProfileDetail profile={selectedProfile} />}
        </div>
      </Drawer>

      <Modal
        open={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        aria-labelledby="filter-modal-title"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}>
          <Typography id="filter-modal-title" variant="h6" component="h2" gutterBottom>
            Filter Profiles
          </Typography>
          <Box sx={{ my: 3 }}>
            <Typography gutterBottom>Experience (years)</Typography>
            <Slider
              value={filters.experience}
              onChange={handleFilterChange('experience')}
              valueLabelDisplay="auto"
              min={0}
              max={40}
            />
          </Box>
          <Box sx={{ my: 3 }}>
            <Typography gutterBottom>Pay ($/hour)</Typography>
            <Slider
              value={filters.pay}
              onChange={handleFilterChange('pay')}
              valueLabelDisplay="auto"
              min={0}
              max={300}
            />
          </Box>
          <Box sx={{ my: 3 }}>
            <Typography gutterBottom>Minimum Hours per Week</Typography>
            <Slider
              value={filters.minHoursWeek}
              onChange={handleFilterChange('minHoursWeek')}
              valueLabelDisplay="auto"
              min={0}
              max={50}
            />
          </Box>
          <Box sx={{ my: 3 }}>
            <Typography gutterBottom>Languages</Typography>
            <Autocomplete
              multiple
              id="languages-filter"
              options={allLanguages}
              value={filters.languages}
              onChange={(event, newValue) => {
                handleFilterChange('languages')(event, newValue);
              }}
              renderInput={(params) => (
                <TextField {...params} variant="outlined" label="Select languages" />
              )}
              renderTags={(value: string[], getTagProps) =>
                value.map((option: string, index: number) => (
                  <Chip variant="outlined" label={option} {...getTagProps({ index })} />
                ))
              }
            />
          </Box>
          <Button onClick={() => setIsFilterModalOpen(false)}>Close</Button>
        </Box>
      </Modal>
    </Container>
  );
}

export default App;