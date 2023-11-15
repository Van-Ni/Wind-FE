// @mui
import { Button, Divider, IconButton, Stack } from '@mui/material';
import { FacebookLogo, GithubLogo, GoogleLogo, TwitterLogo } from 'phosphor-react';
import { BASE_URL } from '../../config';

// ----------------------------------------------------------------------

export default function AuthSocial() {


  const handleGoogleLogin = async () => {
    window.open(`${BASE_URL}auth/google`, "_self");
  };

  const handleGithubLogin = async () => {
    window.open(`${BASE_URL}auth/github`, "_self");
  };

  const handleFacebookLogin = async () => {
    window.open(`${BASE_URL}auth/facebook`, "_self");
  };

  return (
    <div style={{ marginTop: "0" }}>
      <Divider
        sx={{
          my: 2.5,
          typography: 'overline',
          color: 'text.disabled',
          '&::before, ::after': {
            borderTopStyle: 'dashed',
          },
        }}
      >
        OR
      </Divider>

      <Stack direction="column" justifyContent="center" spacing={2}>
        <Button variant="outlined" onClick={handleGoogleLogin} startIcon={<GoogleLogo color="#DF3E30" />}>
          Login with Google
        </Button>
        <Button variant="outlined" onClick={handleGithubLogin} startIcon={<GithubLogo />}>
          Login with Github
        </Button>
        <Button variant="outlined" onClick={handleFacebookLogin} startIcon={<FacebookLogo color="#1C9CEA" />}>
          Login with Facebook
        </Button>

      </Stack>
    </div>
  );
}
