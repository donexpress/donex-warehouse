import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { MenuItem, IconButton, Popover } from "@material-ui/core";
import logoDE from "../../../assets/icons/logo_desktop.svg";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import SelectLanguage from "./SelectLanguage";
import { removeAllCookies, getCookie } from "../../../helpers/cookieUtils";
import { Profile } from "../../../types/profile";
import { useIntl } from "react-intl";
import { isOMS, isWMS } from "../../../helpers";
import HorizontalMenu from "./HorizontalMenu";
import userIcon from "../../../assets/icons/user.svg";
import { BiExit } from "react-icons/bi";

const Header = () => {
  const intl = useIntl();
  const router = useRouter();
  const { locale } = router.query;
  const [anchorEl, setAnchorEl] = useState(null);
  const [profile, setProfile] = useState<Profile | null>(null);

  const handleMenuOpen = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const exitApp = () => {
    setAnchorEl(null);
    removeAllCookies();

    if (isWMS()) {
      router.push(`/${locale}/wms/login`);
    } else {
      router.push(`/${locale}/oms/login`);
    }
  };

  const goHome = () => {
    if (isWMS()) {
      router.push(`/${locale}/wms`);
    } else {
      router.push(`/${locale}/oms`);
    }
  };

  useEffect(() => {
    if (isWMS()) {
      const data = getCookie("profileWMS");
      if (data !== undefined) {
        setProfile(data);
      }
    }
    if (isOMS()) {
      const data = getCookie("profileOMS");
      if (data !== undefined) {
        setProfile(data);
      }
    }
  }, []);

  return (
    <header className="bg-gray-800 text-white header">
      <div className="container-header">
        <div className="flex flex-row justify-start section-left">
          <div className="container-header__image-content">
            <Image
              src={logoDE}
              alt=""
              className="container-header__img"
              onClick={() => {
                goHome();
              }}
            />
          </div>
        </div>
        <div className="flex justify-end items-center section-right">
          <SelectLanguage />
          <div className="container-header__menu-user">
            <div
              onClick={handleMenuOpen}
              className="flex justify-start items-center"
            >
              <div className="pr-2 -mt-1">
                <Image
                  src={userIcon}
                  alt=""
                  className="container-header__icon"
                />
              </div>
              {
                profile !== null && (
                  <div className="elements-center-start">
                    <span style={{ fontSize: '10px', minHeight: '18px' }}>{intl.formatMessage({ id: "hello" })},</span>
                    <span className='container-header__username'>{profile.username}</span>
                  </div>
                )
              }
            </div>

            <Popover
              className="user-Popover"
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "center",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "center",
              }}
              PaperProps={{
                style: {
                  minWidth: "160px",
                  marginTop: "18px",
                },
              }}
            >
              <MenuItem onClick={exitApp}>
                <ExitToAppIcon style={{ marginRight: "8px" }} />
                {intl.formatMessage({ id: "exitApp" })}
              </MenuItem>
            </Popover>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
