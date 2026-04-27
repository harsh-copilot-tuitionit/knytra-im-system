import time


def main() -> None:
    print('Knytra IM worker started')
    while True:
        print('Checking for queued outreach jobs...')
        time.sleep(10)


if __name__ == '__main__':
    main()
