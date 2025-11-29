from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

SQLALCHEMY_DATABASE_URL = ('mysql+pymysql://%s:%s@%s:%s/%s' %
                           ('hackathon', 'Zaq12wsx', 'localhost', '3306', 'hangnow_test'))
engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()