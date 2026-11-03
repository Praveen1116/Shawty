from sqlalchemy import(
    CheckConstraint,
    DateTime,
    String,
    Text,
    text,
)

from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base

class URL(Base):
    __tablename__ = "urls"

    short_code: Mapped[str] = mapped_column(
        String(6),
        primary_key=True,
    )

    original_url: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )

    created_at: Mapped[DateTime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=text("CURRENT_TIMESTAMP"),
    )

    __table_args__ = (
        CheckConstraint(
            "short_code ~ '^[A-Za-z0-9]{6}$'",
            name="valid_short_code",
        ),
    )