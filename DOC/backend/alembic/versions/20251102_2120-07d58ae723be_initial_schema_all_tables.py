"""Initial schema - all tables

Revision ID: 07d58ae723be
Revises:
Create Date: 2025-11-02 21:20:35.738037

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


# revision identifiers, used by Alembic.
revision: str = '07d58ae723be'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Enable extensions
    op.execute("CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\"")
    op.execute("CREATE EXTENSION IF NOT EXISTS pg_trgm")

    # Enums
    userrole_enum = postgresql.ENUM('admin', 'professional', name='userrole', create_type=False)
    userrole_enum.create(op.get_bind(), checkfirst=True)

    gender_enum = postgresql.ENUM('male', 'female', 'other', name='gender', create_type=False)
    gender_enum.create(op.get_bind(), checkfirst=True)

    studentstatus_enum = postgresql.ENUM('active', 'inactive', name='studentstatus', create_type=False)
    studentstatus_enum.create(op.get_bind(), checkfirst=True)

    traildifficulty_enum = postgresql.ENUM('beginner', 'intermediate', 'advanced', name='traildifficulty', create_type=False)
    traildifficulty_enum.create(op.get_bind(), checkfirst=True)

    recordingstatus_enum = postgresql.ENUM('pending', 'processing', 'completed', 'failed', name='recordingstatus', create_type=False)
    recordingstatus_enum.create(op.get_bind(), checkfirst=True)

    activitytype_enum = postgresql.ENUM('reading', 'writing', 'diagnostic', name='activitytype', create_type=False)
    activitytype_enum.create(op.get_bind(), checkfirst=True)

    activitydifficulty_enum = postgresql.ENUM('easy', 'medium', 'hard', name='activitydifficulty', create_type=False)
    activitydifficulty_enum.create(op.get_bind(), checkfirst=True)

    activitystatus_enum = postgresql.ENUM('pending', 'in_progress', 'completed', name='activitystatus', create_type=False)
    activitystatus_enum.create(op.get_bind(), checkfirst=True)

    diagnostictype_enum = postgresql.ENUM('initial', 'ongoing', 'final', name='diagnostictype', create_type=False)
    diagnostictype_enum.create(op.get_bind(), checkfirst=True)

    reporttype_enum = postgresql.ENUM('progress', 'diagnostic', 'full', name='reporttype', create_type=False)
    reporttype_enum.create(op.get_bind(), checkfirst=True)

    reportformat_enum = postgresql.ENUM('pdf', 'csv', name='reportformat', create_type=False)
    reportformat_enum.create(op.get_bind(), checkfirst=True)

    insighttype_enum = postgresql.ENUM('attention_needed', 'progress', 'suggestion', name='insighttype', create_type=False)
    insighttype_enum.create(op.get_bind(), checkfirst=True)

    insightpriority_enum = postgresql.ENUM('low', 'medium', 'high', name='insightpriority', create_type=False)
    insightpriority_enum.create(op.get_bind(), checkfirst=True)

    # users
    op.create_table(
        'users',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True, nullable=False),
        sa.Column('email', sa.String(255), nullable=False),
        sa.Column('password_hash', sa.String(255), nullable=False),
        sa.Column('name', sa.String(255), nullable=False),
        sa.Column('role', userrole_enum, nullable=False),
        sa.Column('function', sa.String(255), nullable=True),
        sa.Column('username', sa.String(255), unique=True, nullable=True),
        sa.Column('google_id', sa.String(255), unique=True, nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )
    op.create_index('ix_users_email', 'users', ['email'], unique=True)
    op.create_index('ix_users_role', 'users', ['role'])
    op.create_index('ix_users_username', 'users', ['username'], unique=True)

    # students
    op.create_table(
        'students',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True, nullable=False),
        sa.Column('professional_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('users.id', ondelete='CASCADE'), nullable=False),
        sa.Column('name', sa.String(255), nullable=False),
        sa.Column('registration', sa.String(50), nullable=True),
        sa.Column('gender', gender_enum, nullable=True),
        sa.Column('birth_date', sa.Date, nullable=True),
        sa.Column('age', sa.Integer, nullable=True),
        sa.Column('observations', sa.Text, nullable=True),
        sa.Column('profile_image', sa.String(500), nullable=True),
        sa.Column('special_needs', postgresql.JSONB, nullable=True),
        sa.Column('status', studentstatus_enum, nullable=False, server_default='active'),
        sa.Column('created_by', postgresql.UUID(as_uuid=True), sa.ForeignKey('users.id', ondelete='SET NULL'), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column('updated_by', postgresql.UUID(as_uuid=True), sa.ForeignKey('users.id', ondelete='SET NULL'), nullable=True),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column('deleted_at', sa.DateTime(timezone=True), nullable=True),
    )
    op.create_index('ix_students_professional_id', 'students', ['professional_id'])
    op.create_index('ix_students_status', 'students', ['status'])
    op.create_index(
        'idx_students_name_gin', 'students', ['name'],
        postgresql_using='gin', postgresql_ops={'name': 'gin_trgm_ops'}
    )

    # trails
    op.create_table(
        'trails',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True, nullable=False),
        sa.Column('title', sa.String(255), nullable=False),
        sa.Column('description', sa.Text, nullable=True),
        sa.Column('created_by', postgresql.UUID(as_uuid=True), sa.ForeignKey('users.id'), nullable=True),
        sa.Column('difficulty', traildifficulty_enum, nullable=False),
        sa.Column('is_default', sa.Boolean, server_default='false', nullable=False),
        sa.Column('age_range_min', sa.Integer, nullable=True),
        sa.Column('age_range_max', sa.Integer, nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column('updated_by', postgresql.UUID(as_uuid=True), sa.ForeignKey('users.id', ondelete='SET NULL'), nullable=True),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )
    op.create_index('ix_trails_created_by', 'trails', ['created_by'])
    op.create_index('ix_trails_difficulty', 'trails', ['difficulty'])

    # trail_stories
    op.create_table(
        'trail_stories',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True, nullable=False),
        sa.Column('trail_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('trails.id', ondelete='CASCADE'), nullable=False),
        sa.Column('title', sa.String(255), nullable=False),
        sa.Column('subtitle', sa.String(255), nullable=True),
        sa.Column('content', sa.Text, nullable=False),
        sa.Column('letters_focus', postgresql.ARRAY(sa.String()), nullable=True),
        sa.Column('phonemes_focus', postgresql.ARRAY(sa.String()), nullable=True),
        sa.Column('order_position', sa.Integer, nullable=False),
        sa.Column('difficulty', traildifficulty_enum, nullable=True),
        sa.Column('word_count', sa.Integer, nullable=True),
        sa.Column('estimated_time', sa.Integer, nullable=True),
        sa.Column('created_by', postgresql.UUID(as_uuid=True), sa.ForeignKey('users.id', ondelete='SET NULL'), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column('updated_by', postgresql.UUID(as_uuid=True), sa.ForeignKey('users.id', ondelete='SET NULL'), nullable=True),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )
    op.create_index('ix_trail_stories_trail_id', 'trail_stories', ['trail_id'])
    op.create_index('idx_trail_stories_order', 'trail_stories', ['trail_id', 'order_position'])

    # recordings
    op.create_table(
        'recordings',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True, nullable=False),
        sa.Column('student_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('students.id', ondelete='CASCADE'), nullable=False),
        sa.Column('story_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('trail_stories.id', ondelete='CASCADE'), nullable=False),
        sa.Column('audio_file_path', sa.String(500), nullable=True),
        sa.Column('audio_url', sa.String(500), nullable=True),
        sa.Column('duration_seconds', sa.Float, nullable=False),
        sa.Column('recorded_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column('transcription', sa.Text, nullable=True),
        sa.Column('status', recordingstatus_enum, nullable=False, server_default='pending'),
        sa.Column('created_by', postgresql.UUID(as_uuid=True), sa.ForeignKey('users.id', ondelete='SET NULL'), nullable=True),
        sa.Column('updated_by', postgresql.UUID(as_uuid=True), sa.ForeignKey('users.id', ondelete='SET NULL'), nullable=True),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )
    op.create_index('ix_recordings_student_id', 'recordings', ['student_id'])
    op.create_index('ix_recordings_story_id', 'recordings', ['story_id'])
    op.create_index('ix_recordings_recorded_at', 'recordings', ['recorded_at'])
    op.create_index('ix_recordings_status', 'recordings', ['status'])
    op.create_index('idx_recordings_student_date', 'recordings', ['student_id', 'recorded_at'])

    # recording_analysis
    op.create_table(
        'recording_analysis',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True, nullable=False),
        sa.Column('recording_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('recordings.id', ondelete='CASCADE'), unique=True, nullable=False),
        sa.Column('fluency_score', sa.Float, nullable=True),
        sa.Column('prosody_score', sa.Float, nullable=True),
        sa.Column('speed_wpm', sa.Float, nullable=True),
        sa.Column('accuracy_score', sa.Float, nullable=True),
        sa.Column('overall_score', sa.Float, nullable=True),
        sa.Column('errors_detected', postgresql.JSONB, nullable=True),
        sa.Column('pauses_analysis', postgresql.JSONB, nullable=True),
        sa.Column('ai_feedback', sa.Text, nullable=True),
        sa.Column('ai_recommendations', postgresql.JSONB, nullable=True),
        sa.Column('processed_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.CheckConstraint('fluency_score >= 0 AND fluency_score <= 100', name='ck_fluency_score'),
        sa.CheckConstraint('prosody_score >= 0 AND prosody_score <= 100', name='ck_prosody_score'),
        sa.CheckConstraint('speed_wpm >= 0', name='ck_speed_wpm'),
        sa.CheckConstraint('accuracy_score >= 0 AND accuracy_score <= 100', name='ck_accuracy_score'),
        sa.CheckConstraint('overall_score >= 0 AND overall_score <= 100', name='ck_overall_score'),
    )
    op.create_index(
        'idx_recording_analysis_errors', 'recording_analysis', ['errors_detected'],
        postgresql_using='gin'
    )

    # student_trail_progress
    op.create_table(
        'student_trail_progress',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True, nullable=False),
        sa.Column('student_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('students.id', ondelete='CASCADE'), nullable=False),
        sa.Column('trail_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('trails.id', ondelete='CASCADE'), nullable=False),
        sa.Column('current_story_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('trail_stories.id', ondelete='SET NULL'), nullable=True),
        sa.Column('completed_stories', postgresql.ARRAY(postgresql.UUID(as_uuid=True)), server_default='{}', nullable=False),
        sa.Column('progress_percentage', sa.Float, server_default='0.0', nullable=False),
        sa.Column('started_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column('last_accessed_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column('completed_at', sa.DateTime(timezone=True), nullable=True),
        sa.UniqueConstraint('student_id', 'trail_id', name='unique_student_trail'),
    )
    op.create_index('ix_student_trail_progress_student_id', 'student_trail_progress', ['student_id'])
    op.create_index('ix_student_trail_progress_trail_id', 'student_trail_progress', ['trail_id'])

    # activities
    op.create_table(
        'activities',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True, nullable=False),
        sa.Column('created_by', postgresql.UUID(as_uuid=True), sa.ForeignKey('users.id', ondelete='CASCADE'), nullable=False),
        sa.Column('title', sa.String(255), nullable=False),
        sa.Column('description', sa.Text, nullable=True),
        sa.Column('type', activitytype_enum, nullable=False),
        sa.Column('difficulty', activitydifficulty_enum, nullable=True),
        sa.Column('scheduled_date', sa.Date, nullable=True),
        sa.Column('scheduled_time', sa.Time, nullable=True),
        sa.Column('words', postgresql.ARRAY(sa.String()), nullable=True),
        sa.Column('status', activitystatus_enum, nullable=False, server_default='pending'),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column('updated_by', postgresql.UUID(as_uuid=True), sa.ForeignKey('users.id', ondelete='SET NULL'), nullable=True),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )
    op.create_index('ix_activities_created_by', 'activities', ['created_by'])
    op.create_index('ix_activities_scheduled_date', 'activities', ['scheduled_date'])
    op.create_index('ix_activities_status', 'activities', ['status'])
    op.create_index('idx_activities_created_scheduled', 'activities', ['created_by', 'scheduled_date'])

    # student_activities
    op.create_table(
        'student_activities',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True, nullable=False),
        sa.Column('student_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('students.id', ondelete='CASCADE'), nullable=False),
        sa.Column('activity_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('activities.id', ondelete='CASCADE'), nullable=False),
        sa.Column('status', activitystatus_enum, nullable=False, server_default='pending'),
        sa.Column('score', sa.Float, nullable=True),
        sa.Column('completed_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('notes', sa.Text, nullable=True),
        sa.UniqueConstraint('student_id', 'activity_id', name='unique_student_activity'),
    )

    # diagnostics
    op.create_table(
        'diagnostics',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True, nullable=False),
        sa.Column('student_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('students.id', ondelete='CASCADE'), nullable=False),
        sa.Column('conducted_by', postgresql.UUID(as_uuid=True), sa.ForeignKey('users.id', ondelete='CASCADE'), nullable=False),
        sa.Column('diagnostic_type', diagnostictype_enum, nullable=False),
        sa.Column('overall_score', sa.Float, nullable=True),
        sa.Column('reading_level', sa.String(50), nullable=True),
        sa.Column('strengths', postgresql.JSONB, nullable=True),
        sa.Column('difficulties', postgresql.JSONB, nullable=True),
        sa.Column('recommendations', sa.Text, nullable=True),
        sa.Column('ai_insights', postgresql.JSONB, nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column('updated_by', postgresql.UUID(as_uuid=True), sa.ForeignKey('users.id', ondelete='SET NULL'), nullable=True),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )
    op.create_index('ix_diagnostics_student_id', 'diagnostics', ['student_id'])
    op.create_index('ix_diagnostics_diagnostic_type', 'diagnostics', ['diagnostic_type'])
    op.create_index('idx_diagnostics_student_created', 'diagnostics', ['student_id', 'created_at'])
    op.create_index(
        'idx_diagnostics_difficulties', 'diagnostics', ['difficulties'],
        postgresql_using='gin'
    )

    # reports
    op.create_table(
        'reports',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True, nullable=False),
        sa.Column('student_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('students.id', ondelete='CASCADE'), nullable=False),
        sa.Column('generated_by', postgresql.UUID(as_uuid=True), sa.ForeignKey('users.id', ondelete='CASCADE'), nullable=False),
        sa.Column('report_type', reporttype_enum, nullable=False),
        sa.Column('period_start', sa.Date, nullable=True),
        sa.Column('period_end', sa.Date, nullable=True),
        sa.Column('file_path', sa.String(500), nullable=True),
        sa.Column('file_url', sa.String(500), nullable=True),
        sa.Column('format', reportformat_enum, nullable=False),
        sa.Column('generated_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column('updated_by', postgresql.UUID(as_uuid=True), sa.ForeignKey('users.id', ondelete='SET NULL'), nullable=True),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )

    # ai_insights
    op.create_table(
        'ai_insights',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True, nullable=False),
        sa.Column('professional_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('users.id', ondelete='CASCADE'), nullable=False),
        sa.Column('insight_type', insighttype_enum, nullable=False),
        sa.Column('priority', insightpriority_enum, nullable=False, server_default='medium'),
        sa.Column('title', sa.String(255), nullable=False),
        sa.Column('description', sa.Text, nullable=False),
        sa.Column('related_students', postgresql.ARRAY(postgresql.UUID(as_uuid=True)), nullable=True),
        sa.Column('is_read', sa.Boolean, server_default='false', nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column('expires_at', sa.DateTime(timezone=True), nullable=True),
    )


def downgrade() -> None:
    op.drop_table('ai_insights')
    op.drop_table('reports')
    op.drop_table('diagnostics')
    op.drop_table('student_activities')
    op.drop_table('activities')
    op.drop_table('student_trail_progress')
    op.drop_table('recording_analysis')
    op.drop_table('recordings')
    op.drop_table('trail_stories')
    op.drop_table('trails')
    op.drop_table('students')
    op.drop_table('users')

    op.execute("DROP TYPE IF EXISTS insightpriority")
    op.execute("DROP TYPE IF EXISTS insighttype")
    op.execute("DROP TYPE IF EXISTS reportformat")
    op.execute("DROP TYPE IF EXISTS reporttype")
    op.execute("DROP TYPE IF EXISTS diagnostictype")
    op.execute("DROP TYPE IF EXISTS activitystatus")
    op.execute("DROP TYPE IF EXISTS activitydifficulty")
    op.execute("DROP TYPE IF EXISTS activitytype")
    op.execute("DROP TYPE IF EXISTS recordingstatus")
    op.execute("DROP TYPE IF EXISTS traildifficulty")
    op.execute("DROP TYPE IF EXISTS studentstatus")
    op.execute("DROP TYPE IF EXISTS gender")
    op.execute("DROP TYPE IF EXISTS userrole")
