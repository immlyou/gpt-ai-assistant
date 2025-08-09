import db
from flask import Flask, request, jsonify
from flask_cors import CORS

# Create a Flask application instance
app = Flask(__name__)

# Enable CORS for all routes, allowing the frontend to communicate with this API
CORS(app, resources={r"/api/*": {"origins": "*"}})

@app.route('/')
def index():
    """A simple route to confirm the API is running."""
    return {"message": "Welcome to the Clinic Inventory API"}

# --- Vaccine Master Data API Endpoints ---

@app.route('/api/vaccines', methods=['GET'])
def get_vaccines():
    """Fetches all vaccine master records."""
    conn = None
    try:
        conn = db.get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT id, name, manufacturer, type, total_doses_required FROM vaccines ORDER BY name")
        vaccines = cursor.fetchall()

        # Convert list of tuples to list of dicts for JSON serialization
        vaccine_list = [
            dict(zip([column[0] for column in cursor.description], row))
            for row in vaccines
        ]

        cursor.close()
        return jsonify(vaccine_list)
    except Exception as e:
        print(f"Error fetching vaccines: {e}")
        return jsonify({"error": "Failed to fetch vaccines"}), 500
    finally:
        if conn:
            db.release_db_connection(conn)

@app.route('/api/vaccines', methods=['POST'])
def add_vaccine():
    """Adds a new vaccine master record."""
    data = request.get_json()
    if not data or not all(k in data for k in ['name', 'manufacturer', 'type', 'total_doses_required']):
        return jsonify({"error": "Missing required fields"}), 400

    conn = None
    try:
        conn = db.get_db_connection()
        cursor = conn.cursor()

        sql = """
            INSERT INTO vaccines (name, manufacturer, type, total_doses_required)
            VALUES (%s, %s, %s, %s) RETURNING id;
        """
        cursor.execute(sql, (
            data['name'],
            data['manufacturer'],
            data['type'],
            data['total_doses_required']
        ))

        new_id = cursor.fetchone()[0]
        conn.commit()
        cursor.close()

        return jsonify({"id": new_id, **data}), 201
    except Exception as e:
        if conn:
            conn.rollback()
        print(f"Error adding vaccine: {e}")
        return jsonify({"error": "Failed to add vaccine"}), 500
    finally:
        if conn:
            db.release_db_connection(conn)

# --- Inventory Lot API Endpoints ---

@app.route('/api/inventory', methods=['GET'])
def get_inventory():
    """Fetches all inventory lot records, joined with vaccine info."""
    conn = None
    try:
        conn = db.get_db_connection()
        cursor = conn.cursor()

        sql = """
            SELECT
                i.id,
                i.vaccine_id,
                v.name as vaccine_name,
                v.manufacturer,
                i.lot_number,
                i.quantity_on_hand,
                i.expiration_date
            FROM inventory_lots i
            JOIN vaccines v ON i.vaccine_id = v.id
            ORDER BY i.expiration_date;
        """
        cursor.execute(sql)
        inventory = cursor.fetchall()

        inventory_list = [
            dict(zip([column[0] for column in cursor.description], row))
            for row in inventory
        ]

        cursor.close()
        return jsonify(inventory_list)
    except Exception as e:
        print(f"Error fetching inventory: {e}")
        return jsonify({"error": "Failed to fetch inventory"}), 500
    finally:
        if conn:
            db.release_db_connection(conn)

@app.route('/api/inventory', methods=['POST'])
def add_inventory_lot():
    """Adds a new inventory lot (shipment)."""
    data = request.get_json()
    if not data or not all(k in data for k in ['vaccine_id', 'lot_number', 'quantity_on_hand', 'expiration_date']):
        return jsonify({"error": "Missing required fields"}), 400

    conn = None
    try:
        conn = db.get_db_connection()
        cursor = conn.cursor()

        sql = """
            INSERT INTO inventory_lots (vaccine_id, lot_number, quantity_on_hand, expiration_date)
            VALUES (%s, %s, %s, %s) RETURNING id;
        """
        cursor.execute(sql, (
            data['vaccine_id'],
            data['lot_number'],
            data['quantity_on_hand'],
            data['expiration_date']
        ))

        new_id = cursor.fetchone()[0]
        conn.commit()
        cursor.close()

        return jsonify({"id": new_id, **data}), 201
    except Exception as e:
        if conn:
            conn.rollback()
        print(f"Error adding inventory lot: {e}")
        return jsonify({"error": "Failed to add inventory lot"}), 500
    finally:
        if conn:
            db.release_db_connection(conn)


# --- Usage Log API Endpoints ---

@app.route('/api/usage', methods=['POST'])
def log_usage():
    """Logs vaccine usage and decrements inventory."""
    data = request.get_json()
    if not data or not all(k in data for k in ['inventory_lot_id', 'quantity_used']):
        return jsonify({"error": "Missing required fields"}), 400

    inventory_lot_id = data['inventory_lot_id']
    quantity_used = data.get('quantity_used', 1)
    patient_identifier = data.get('patient_identifier') # Optional

    conn = None
    try:
        conn = db.get_db_connection()
        cursor = conn.cursor()

        # Start transaction
        # In psycopg2, a transaction is automatically started with the first command.
        # We just need to explicitly commit or rollback.

        # 1. Check if there is enough quantity
        cursor.execute("SELECT quantity_on_hand FROM inventory_lots WHERE id = %s FOR UPDATE", (inventory_lot_id,))
        lot = cursor.fetchone()
        if lot is None:
            return jsonify({"error": "Inventory lot not found"}), 404
        if lot[0] < quantity_used:
            return jsonify({"error": "Not enough quantity on hand"}), 400

        # 2. Decrement the inventory quantity
        update_sql = """
            UPDATE inventory_lots
            SET quantity_on_hand = quantity_on_hand - %s
            WHERE id = %s;
        """
        cursor.execute(update_sql, (quantity_used, inventory_lot_id))

        # 3. Insert a record into the usage log
        log_sql = """
            INSERT INTO usage_logs (inventory_lot_id, patient_identifier, notes)
            VALUES (%s, %s, %s) RETURNING id;
        """
        notes = f"Used {quantity_used} dose(s)."
        cursor.execute(log_sql, (inventory_lot_id, patient_identifier, notes))

        # Commit the transaction
        conn.commit()
        cursor.close()

        return jsonify({"message": "Usage logged successfully"}), 201
    except Exception as e:
        if conn:
            conn.rollback()
        print(f"Error logging usage: {e}")
        return jsonify({"error": "Failed to log usage"}), 500
    finally:
        if conn:
            db.release_db_connection(conn)


# This allows the script to be run directly
if __name__ == '__main__':
    # You would typically run `python db.py` first to set up the DB
    # Then run `flask run` or `python app.py` to start the server
    app.run(debug=True, port=5001) # Using a different port to avoid conflicts
