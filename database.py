from sqlalchemy import create_engine, Column, Integer, String, Float, Boolean, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship

Base = declarative_base()

class Property(Base):
    __tablename__ = 'properties'
    
    id = Column(Integer, primary_key=True)
    title = Column(String, nullable=False)
    location = Column(String, nullable=False)
    price = Column(Float, nullable=False)
    total_area = Column(Float, nullable=False)
    bedrooms = Column(Integer)
    baths = Column(Integer)
    has_balcony = Column(Boolean, default=False)
    city = Column(String)
    state = Column(String)
    is_featured = Column(Boolean, default=False)
    images = relationship("PropertyImage", back_populates="property")

class PropertyImage(Base):
    __tablename__ = 'property_images'
    
    id = Column(Integer, primary_key=True)
    url = Column(String, nullable=False)
    property_id = Column(Integer, ForeignKey('properties.id'))
    property = relationship("Property", back_populates="images")

# Create SQLite database engine
engine = create_engine('sqlite:///data/property_db.sqlite')

# Create all tables
Base.metadata.create_all(engine)