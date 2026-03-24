#!/usr/bin/env python3
import argparse
import os
import subprocess
import sys

from app.versioning import app_meta


def cmd_dns_bridge_server():
    from app.dns_bridge import run_dns_bridge_server

    run_dns_bridge_server()


def _run_alembic(*args: str) -> None:
    env = os.environ.copy()
    env["PYTHONPATH"] = os.getcwd()
    subprocess.check_call([sys.executable, "-m", "alembic", *args], env=env)


def cmd_migrate():
    _run_alembic("upgrade", "head")


def cmd_check_migrations():
    _run_alembic("check")


def cmd_version():
    meta = app_meta()
    print(f"{meta.app_name} server {meta.version_name} ({meta.version_code}) [{meta.release_channel}]")


def main():
    p = argparse.ArgumentParser()
    p.add_argument("command", choices=["dns-bridge-server", "migrate", "check-migrations", "version"])
    args, _ = p.parse_known_args()

    if args.command == "dns-bridge-server":
        cmd_dns_bridge_server()
    elif args.command == "migrate":
        cmd_migrate()
    elif args.command == "check-migrations":
        cmd_check_migrations()
    elif args.command == "version":
        cmd_version()


if __name__ == "__main__":
    main()
