import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import {
  Container,
  Group,
  Anchor,
  Modal,
  Divider,
  Tooltip,
  ActionIcon,
  Burger,
  Drawer,
  Stack,
  Menu,
  rem,
} from "@mantine/core";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import PopupAuth from "./PopupAuth";
import {
  IconSettings,
  IconLogout,
  IconUser,
  IconUserPlus,
  IconScan,
  IconSun,
  IconMoon,
} from "@tabler/icons-react";
import logout from "../utils/logout"; // Import the logout function
import { hackathonInfo } from "../data/hackathonInfo";
import { useColorSchemeToggle } from "../utils/colorSchemeToggle";

const Nav = () => {
  const { user, setUser, loading } = useUser();
  const [opened, { open, close }] = useDisclosure(false);
  const [authType, setAuthType] = useState("login"); // Add authType state
  const { toggleColorScheme, currentColorScheme } = useColorSchemeToggle();
  const [drawerOpened, { open: openDrawer, close: closeDrawer }] =
    useDisclosure(false);

  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width: 768px)");

  const handleLogout = () => {
    logout(setUser, navigate);
  };

  const openLoginModal = () => {
    setAuthType("login");
    open();
    closeDrawer();
  };

  const openRegisterModal = () => {
    setAuthType("register");
    open();
    closeDrawer();
  };

  return (
    <>
      <Container
        size="lg"
        py="md"
        px="lg"
        style={{
          width: isMobile ? "100vw" : "80%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Anchor
          component={Link}
          to="/"
          size="lg"
          style={{
            fontWeight: "bold",
          }}
        >
          {hackathonInfo.name}
        </Anchor>
        {!isMobile && (
          <Group spacing="xs">
            <Anchor component={Link} to="/about">
              About
            </Anchor>
            <Anchor component={Link} to="/schedule">
              Schedule
            </Anchor>
            <Anchor component={Link} to="/faq">
              FAQs
            </Anchor>
            <Anchor component={Link} to="/rules">
              Rules
            </Anchor>
          </Group>
        )}
        <Group spacing="xs">
          {isMobile ? (
            <Burger opened={drawerOpened} onClick={openDrawer} size="sm" />
          ) : (
            <>
              <Menu width={200} trigger="click-hover">
                <Menu.Target>
                  <Anchor>Account</Anchor>
                </Menu.Target>
                {user ? (
                  <Menu.Dropdown>
                    <Menu.Label>My Account</Menu.Label>
                    <Menu.Item
                      leftSection={
                        <IconUser style={{ width: rem(14), height: rem(14) }} />
                      }
                      component={Link}
                      to="/profile"
                    >
                      Profile
                    </Menu.Item>
                    {user.role === "admin" && (
                      <>
                        <Menu.Divider />
                        <Menu.Label>Admin</Menu.Label>
                        <Menu.Item
                          leftSection={
                            <IconSettings
                              style={{ width: rem(14), height: rem(14) }}
                            />
                          }
                          component={Link}
                          to="/admin"
                        >
                          Admin Panel
                        </Menu.Item>
                        <Menu.Item
                          leftSection={
                            <IconScan
                              style={{ width: rem(14), height: rem(14) }}
                            />
                          }
                          component={Link}
                          to="/admin/scanner"
                        >
                          QR Scanner
                        </Menu.Item>
                      </>
                    )}
                    <Menu.Divider />
                    <Menu.Item
                      color="red"
                      leftSection={
                        <IconLogout
                          style={{ width: rem(14), height: rem(14) }}
                        />
                      }
                      onClick={handleLogout}
                    >
                      Logout
                    </Menu.Item>
                  </Menu.Dropdown>
                ) : (
                  <Menu.Dropdown>
                    <Menu.Label>Not Logged in</Menu.Label>
                    <Menu.Item
                      leftSection={
                        <IconUser style={{ width: rem(14), height: rem(14) }} />
                      }
                      onClick={openLoginModal}
                    >
                      Log in
                    </Menu.Item>
                    <Menu.Item
                      leftSection={
                        <IconUserPlus
                          style={{ width: rem(14), height: rem(14) }}
                        />
                      }
                      onClick={openRegisterModal}
                    >
                      Register
                    </Menu.Item>
                  </Menu.Dropdown>
                )}
              </Menu>
              <Tooltip label="Toggle Theme" withArrow>
                <ActionIcon
                  onClick={toggleColorScheme}
                  size={30}
                  variant="subtle"
                >
                  {currentColorScheme === "dark" ? <IconSun /> : <IconMoon />}
                </ActionIcon>
              </Tooltip>
            </>
          )}
        </Group>
      </Container>
      <Divider />
      {!isMobile && (
        <a
          href="https://mlh.io/seasons/2025/events"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            position: "fixed",
            right: "2.5%",
          }}
        >
          <img
            src="/images/mlh_banner.svg"
            alt="MLH Banner"
            style={{
              width: "75px",
              transition: "transform 0.3s ease",
            }}
          />
        </a>
      )}
      <Drawer
        opened={drawerOpened}
        onClose={closeDrawer}
        position="right"
        radius="lg"
        padding="md"
        size="xs"
        title="Menu"
      >
        <Stack spacing="xs">
          <Anchor component={Link} to="/about" onClick={closeDrawer}>
            About
          </Anchor>
          <Anchor component={Link} to="/schedule" onClick={closeDrawer}>
            Schedule
          </Anchor>
          <Anchor component={Link} to="/faq" onClick={closeDrawer}>
            FAQs
          </Anchor>
          <Anchor component={Link} to="/rules" onClick={closeDrawer}>
            Rules
          </Anchor>
          <Divider my="sm" />
          {user ? (
            <>
              <Anchor component={Link} to="/profile" onClick={closeDrawer}>
                Profile
              </Anchor>
              {user.role === "admin" && (
                <>
                  <Anchor component={Link} to="/admin" onClick={closeDrawer}>
                    Admin Panel
                  </Anchor>
                  <Anchor
                    component={Link}
                    to="/admin/scanner"
                    onClick={closeDrawer}
                  >
                    QR Scanner
                  </Anchor>
                </>
              )}
              <Divider my="sm" />
              <Anchor
                c="red"
                onClick={() => {
                  handleLogout();
                  closeDrawer();
                }}
              >
                Logout
              </Anchor>
            </>
          ) : (
            <>
              <Anchor onClick={openLoginModal}>Log in</Anchor>
              <Anchor onClick={openRegisterModal}>Register</Anchor>
            </>
          )}
          <Anchor onClick={toggleColorScheme}>
            {currentColorScheme === "dark"
              ? "Toggle Light Mode"
              : "Toggle Dark Mode"}
          </Anchor>
        </Stack>
      </Drawer>
      <Modal
        size={"sm"}
        opened={opened}
        onClose={close}
        transitionProps={{
          transition: "pop",
        }}
      >
        <Container size="sm">
          <PopupAuth onSuccess={close} initialAuth={authType} />{" "}
        </Container>
      </Modal>
    </>
  );
};

export default Nav;
