from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

SQLALCHEMY_DATABASE_URL = ('mysql+pymysql://%s:%s@%s:%s/%s' %
                           ('root', 'mysqladmin', 'localhost', '3306', 'hangnow'))
engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()