from app.jobs.process_hl7_message import process_hl7_message
from app.queue import consume_hl7_messages
from app.database import init_db


def run() -> None:
    init_db()
    print("FHIRBridge worker started")
    consume_hl7_messages(process_hl7_message)


if __name__ == "__main__":
    run()
