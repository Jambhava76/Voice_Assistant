from __future__ import annotations

import logging
import sys

from backend.app.configurations.settings import AppSettings


def configure_logging(settings: AppSettings) -> None:
    logging.basicConfig(
        level=getattr(logging, settings.log_level.upper(), logging.INFO),
        format="%(asctime)s %(levelname)s %(name)s %(message)s",
        handlers=[logging.StreamHandler(sys.stdout)],
    )
