import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useIntl } from "react-intl";
import classNames from "classnames";
import Image from "next/image";
import { isOMS, isWMS } from "../../../../helpers";
import logoDE from "../../../../assets/icons/logo_desktop.svg";
import logoA2A56 from "../../../../assets/icons/logo_a2a56_x.png";
import logoMV from "../../../../assets/icons/logo_movil.svg";
import { FaAngleLeft, FaList } from "react-icons/fa6";
import { MenuOption } from "../../../../types";
import { menuWMS, menuOMS } from "./../../../../config/menu";
import Icons from "./Icons";
import { removeCookie } from "../../../../helpers/cookieUtils";

const Index = () => {
  const [toggleCollapse, setToggleCollapse] = useState(false);
  const [isCollapse, setIsCollapse] = useState(false);
  const [width, setWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1024
  );
  const [options, setOptions] = useState<MenuOption[]>([]);
  const router = useRouter();
  const intl = useIntl();
  const { locale } = router.query;

  const handleResize = () => {
    setWidth(window.innerWidth);
    if (width <= 991) {
      onToggleCollapse();
    }
  };

  useEffect(() => {
    if (isWMS()) {
      setOptions(menuWMS(intl));
    }
    if (isOMS()) {
      setOptions(menuOMS(intl));
    }
  }, [isWMS, isOMS, intl]);

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    if (window.innerWidth <= 991) {
      setToggleCollapse(true);
    }
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const goHome = () => {
    if (isWMS()) {
      router.push(`/${locale}/wms`);
    } else {
      router.push(`/${locale}/oms`);
    }
  };

  const wrapperClass = classNames(
    "h-screen pt-2 pb-4 flex justify-between flex-col sidebar z-50",
    {
      ["w-96"]: !toggleCollapse || (toggleCollapse && isCollapse),
      ["w-20"]: toggleCollapse,
      ["absolute"]: width <= 991,
      ["-left-3"]: width <= 991 && toggleCollapse,
      ["w-0"]: width <= 991 && toggleCollapse,
    }
  );
  const collapseIconClass = classNames(
    "p-2 rounded-full icon-toggle absolute -right-4",
    {
      ["rotate-180"]: toggleCollapse,
    }
  );

  const getNavItemClass = (menu: MenuOption) => {
    let e = `/[locale]/${isOMS() ? "oms" : ""}${isWMS() ? "wms" : ""}/${
      menu.route
    }`;
    return classNames("flex items-center cursor-pointer nav-item-hover", {
      ["bg-nav-item-hover"]: router.pathname && (router.pathname === e || router.pathname.startsWith(e)),
    });
  };

  const onMouseOver = (mouse = false) => {
    setIsCollapse(mouse);
  };

  const onToggleCollapse = (menu = false) => {
    if (width <= 991) {
      setToggleCollapse(!toggleCollapse);
    } else if (menu) {
      setToggleCollapse(!toggleCollapse);
    }
  };
  return (
    <div
      className={wrapperClass}
      onMouseEnter={() => onMouseOver(true)}
      onMouseLeave={() => onMouseOver(false)}
      style={{ transition: "width 300ms cubic-bezier(0.2, 0, 0, 1) 0s" }}
    >
      <div className="flex flex-col">
        <div className="flex  px-4 items-center justify-between relative">
          <div className="flex">
            <Image
              src={!toggleCollapse ? logoA2A56 : !isCollapse ? logoMV : logoA2A56}
              alt=""
              className="w-auto"
              width={100}
              height={56}
              onClick={() => {
                goHome();
              }}
            />
          </div>
          <button
            onClick={() => {
              onToggleCollapse(true);
            }}
            className={collapseIconClass}
          >
            {width <= 991 && toggleCollapse ? <FaList /> : <FaAngleLeft />}
          </button>
        </div>
        <div className="flex flex-col items-start mt-4 scroll scrollable-hidden">
          <div
            className="group-nav flex flex-col items-start pb-3 cursor-pointer"
            key="HOME"
            onClick={() =>
              router.push(
                `/${locale}/${isOMS() ? "oms" : ""}${isWMS() ? "wms" : ""}`
              )
            }
          >
            <div className="flex py-3 px-4">
              <div className="mr-1 text-xl flex items-center">
                <Icons icons="BiHome" />
              </div>
              <span className="text-base font-medium text-sidebar">{intl.formatMessage({ id: "home" })}</span>
            </div>
          </div>

          {options.map((option, index) => (
            <div
              className="group-nav flex flex-col items-start pb-3"
              key={index}
            >
              <div className="flex py-3 px-4">
                <div className="mr-1 text-xl flex items-center">
                  <Icons icons={option.icon} />
                </div>
                <span className="text-base font-medium text-sidebar">
                  {option.label}
                </span>
              </div>
              {option.items?.map((op, i) => (
                <div className={getNavItemClass(op)} key={i + "-" + index}>
                  {op.route ? (
                    <a
                      className="flex py-3  px-4"
                      onClick={(e) => {
                        e.preventDefault();
                        removeCookie("tabSP");
                        removeCookie("tabEP");
                        removeCookie("tabIO");
                        router.push(
                          `/${locale}/${isOMS() ? "oms" : ""}${
                            isWMS() ? "wms" : ""
                          }/${op.route}`
                        );
                      }}
                      href={`/${locale}/${isOMS() ? "oms" : ""}${
                        isWMS() ? "wms" : ""
                      }/${op.route}`}
                    >
                      {op.icon ? (
                        <>
                          <div className="mr-1 text-xl flex items-center">
                            <Icons icons={op.icon} />
                          </div>
                          <div className="text-base font-medium text-sidebar">
                            {op.label}
                          </div>
                        </>
                      ) : (
                        <div className="text-base font-medium text-sidebar ml-6">
                          {op.label}
                        </div>
                      )}
                    </a>
                  ) : (
                    <div className="flex py-3 px-4">
                      <div className="mr-1 text-xl flex items-center">
                        <Icons icons={op.icon} />
                      </div>

                      <div className="text-base font-medium text-sidebar">
                        {op.label}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;
