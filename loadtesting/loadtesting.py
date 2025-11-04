import requests
import time
import statistics
from concurrent.futures import ThreadPoolExecutor, as_completed
from collections import defaultdict
from datetime import datetime

class LoadTester:
    def __init__(self, url, concurrency=50, duration=60, timeout=10):
        self.url = url
        self.concurrency = concurrency
        self.duration = duration
        self.timeout = timeout
        self.results = []
        self.errors = []
        self.start_time = None
        self.end_time = None
        
    def make_request(self):
        try:
            start = time.time()
            response = requests.get(self.url, timeout=self.timeout)
            elapsed = time.time() - start
            
            result = {
                'status_code': response.status_code,
                'response_time': elapsed,
                'success': 200 <= response.status_code < 400,
                'timestamp': time.time()
            }
            return result
        except Exception as e:
            elapsed = time.time() - start if 'start' in locals() else 0
            return {
                'status_code': None,
                'response_time': elapsed,
                'success': False,
                'error': str(e),
                'timestamp': time.time()
            }
    
    def run(self):
        print(f"Starting load test...")
        print(f"URL: {self.url}")
        print(f"Concurrency: {self.concurrency}")
        print(f"Duration: {self.duration}s")
        print("-" * 60)
        
        self.start_time = time.time()
        end_time = self.start_time + self.duration
        
        with ThreadPoolExecutor(max_workers=self.concurrency) as executor:
            futures = []
            request_count = 0
            
            while time.time() < end_time:
                while len(futures) < self.concurrency and time.time() < end_time:
                    future = executor.submit(self.make_request)
                    futures.append(future)
                    request_count += 1
                
                for future in as_completed(futures[:self.concurrency]):
                    result = future.result()
                    self.results.append(result)
                    if not result['success']:
                        self.errors.append(result)
                    futures.remove(future)
                    
                    if time.time() >= end_time:
                        break
                
                if request_count % 100 == 0:
                    elapsed = time.time() - self.start_time
                    print(f"[{elapsed:.1f}s] Requests: {request_count} | "
                          f"Success: {sum(1 for r in self.results if r['success'])} | "
                          f"Errors: {len(self.errors)}")
            
            for future in as_completed(futures):
                result = future.result()
                self.results.append(result)
                if not result['success']:
                    self.errors.append(result)
        
        self.end_time = time.time()
        self.print_summary()
    
    def print_summary(self):
        if not self.results:
            print("No results collected.")
            return
        
        total_time = self.end_time - self.start_time
        response_times = [r['response_time'] for r in self.results if r['response_time'] > 0]
        successful = [r for r in self.results if r['success']]
        failed = len(self.errors)
        
        status_codes = defaultdict(int)
        for r in self.results:
            if r['status_code']:
                status_codes[r['status_code']] += 1
        
        print("\n" + "=" * 60)
        print("LOAD TEST SUMMARY")
        print("=" * 60)
        print(f"Total Duration: {total_time:.2f}s")
        print(f"Total Requests: {len(self.results)}")
        print(f"Successful Requests: {len(successful)}")
        print(f"Failed Requests: {failed}")
        print(f"Success Rate: {(len(successful)/len(self.results)*100):.2f}%")
        print(f"Requests/sec: {len(self.results)/total_time:.2f}")
        
        if response_times:
            print(f"\nResponse Time Statistics:")
            print(f"  Min: {min(response_times)*1000:.2f}ms")
            print(f"  Max: {max(response_times)*1000:.2f}ms")
            print(f"  Mean: {statistics.mean(response_times)*1000:.2f}ms")
            print(f"  Median: {statistics.median(response_times)*1000:.2f}ms")
            if len(response_times) > 1:
                print(f"  Std Dev: {statistics.stdev(response_times)*1000:.2f}ms")
            
            p50 = sorted(response_times)[int(len(response_times) * 0.50)]
            p95 = sorted(response_times)[int(len(response_times) * 0.95)]
            p99 = sorted(response_times)[int(len(response_times) * 0.99)]
            print(f"\nPercentiles:")
            print(f"  p50: {p50*1000:.2f}ms")
            print(f"  p95: {p95*1000:.2f}ms")
            print(f"  p99: {p99*1000:.2f}ms")
        
        print(f"\nStatus Code Distribution:")
        for code, count in sorted(status_codes.items()):
            print(f"  {code}: {count}")
        
        if self.errors:
            print(f"\nErrors ({len(self.errors)}):")
            error_types = defaultdict(int)
            for e in self.errors:
                error_msg = e.get('error', 'Unknown error')
                error_types[error_msg] += 1
            for error, count in error_types.items():
                print(f"  {error}: {count}")

if __name__ == "__main__":
    URL = "http://34.51.178.22/"
    
    tester = LoadTester(
        url=URL,
        concurrency=100,
        duration=60,
        timeout=10
    )
    
    tester.run()
