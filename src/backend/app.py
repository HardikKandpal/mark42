from flask import Flask, request, jsonify
from flask_cors import CORS
import sys
import logging
from pathlib import Path

# Set up logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

project_root = Path(__file__).parent.parent.parent
sys.path.append(str(project_root))

from property_valuation_model import PropertyValuationModel
from rec import PropertyRecommender

app = Flask(__name__)
# Update CORS configuration to handle credentials
CORS(app, resources={
    r"/api/*": {
        "origins": ["http://localhost:5173", "http://[::1]:5173"],
        "supports_credentials": True
    }
})

# Add before request handler for CORS preflight
@app.before_request
def handle_preflight():
    if request.method == "OPTIONS":
        response = app.make_default_options_response()
        response.headers["Access-Control-Allow-Credentials"] = "true"
        return response

# Initialize models with error handling
try:
    valuation_model = PropertyValuationModel(
        model_path=str(project_root / "models/property_valuation_model.pkl"),
        db_path=str(project_root / "data/property_db.sqlite")
    )
    logger.info("Valuation model initialized successfully")
except Exception as e:
    logger.error(f"Error initializing valuation model: {e}")
    raise

try:
    recommender = PropertyRecommender(
        csv_path=str(project_root / "data/Real Estate Data V21.csv")
    )
    logger.info("Recommender model initialized successfully")
except Exception as e:
    logger.error(f"Error initializing recommender: {e}")
    raise

@app.route('/predict-price', methods=['POST'])
def predict_price():
    try:
        data = request.json
        logger.debug(f"Received prediction request with data: {data}")
        
        if not data:
            return jsonify({"error": "No data provided"}), 400
        
        # Validate and convert data types
        processed_data = {
            'city': str(data.get('city', '')),
            'neighborhood': str(data.get('neighborhood', '')),
            'bedrooms': int(data.get('bedrooms', 0)),
            'bathrooms': int(data.get('bathrooms', 0)),
            'total_area': float(data.get('total_area', 0)),
            'has_balcony': bool(data.get('has_balcony', False))
        }
        
        # Validate required fields
        if not all(processed_data.values()):
            return jsonify({"error": "Missing required fields"}), 400
        
        prediction = valuation_model.predict(processed_data)
        logger.debug(f"Prediction result: {prediction}")
        
        if not prediction:
            return jsonify({"error": "Could not generate prediction"}), 500
            
        return jsonify({
            "status": "success",
            "prediction": prediction
        })
    except Exception as e:
        logger.error(f"Error in predict_price: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/get-recommendations', methods=['POST'])
def get_recommendations():
    try:
        data = request.json
        logger.debug(f"Received recommendations request with data: {data}")
        
        # Validate and convert data types
        processed_data = {
            'location': str(data.get('location', '')),
            'min_price': float(data.get('min_price', 0)),
            'max_price': float(data.get('max_price', 0)),
            'bedrooms': str(data.get('bedrooms', '')),
            'property_type': str(data.get('property_type', ''))
        }
        
        recommendations = recommender.get_recommendations(
            location=processed_data['location'],
            min_price=processed_data['min_price'],
            max_price=processed_data['max_price'],
            bedrooms=processed_data['bedrooms'],
            property_type=processed_data['property_type']
        )
        
        return jsonify({
            'status': 'success',
            'recommendations': recommendations
        })
        
    except Exception as e:
        logger.error(f"Error in get_recommendations: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/similar-properties/<int:property_id>')
def get_similar_properties(property_id):
    try:
        logger.debug(f"Received similar properties request for ID: {property_id}")
        
        similar = recommender.get_similar_properties(property_id)
        logger.debug(f"Similar properties result: {similar}")
        
        return jsonify(similar)
    except Exception as e:
        logger.error(f"Error in get_similar_properties: {e}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(port=5000, debug=True)