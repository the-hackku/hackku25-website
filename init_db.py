import sqlite3

DATABASE = 'marketplace.db'

def create_tables(conn):
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            name_first TEXT NOT NULL,
            name_last TEXT NOT NULL,
            password TEXT NOT NULL,
            email TEXT NOT NULL
        );
    """)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS listings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            description TEXT,
            price REAL NOT NULL,
            image_path TEXT,
            dateposted TEXT NOT NULL,
            is_sold BOOLEAN DEFAULT FALSE,
            seller_id INTEGER NOT NULL,
            FOREIGN KEY (seller_id) REFERENCES users(id)
            
        );
    """)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS chats (
            chat_id INTEGER PRIMARY KEY AUTOINCREMENT,
            created_at DATETIME,
            listing_id INTEGER,
            seller_id INTEGER,
            buyer_id INTEGER,
            FOREIGN KEY (seller_id) REFERENCES users(id),
            FOREIGN KEY (buyer_id) REFERENCES users(id),
            FOREIGN KEY (listing_id) REFERENCES listings(id)
        );
    """)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS messages (
            message_id INTEGER PRIMARY KEY AUTOINCREMENT,
            chat_id INTEGER,
            sender_id INTEGER,  
            message_content TEXT,
            sent_at DATETIME,
            read_status BOOLEAN DEFAULT FALSE,
            FOREIGN KEY (chat_id) REFERENCES chats(chat_id),
            FOREIGN KEY (sender_id) REFERENCES users(id)
        );
    """)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS saves (
            user_id INTEGER,
            listing_id INTEGER,
            saved_at DATETIME,
            FOREIGN KEY (user_id) REFERENCES users(id),
            FOREIGN KEY (listing_id) REFERENCES listings(id)
);
    """)

    conn.commit()

if __name__ == '__main__':
    conn = sqlite3.connect(DATABASE)
    create_tables(conn)
    conn.close()
