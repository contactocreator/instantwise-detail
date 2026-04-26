#!/usr/bin/env python3
"""
macOS Accessibility API 브리지
선택된 텍스트를 감지하여 stdout으로 JSON 출력
"""
import json
import sys
import time

try:
    from AppKit import NSWorkspace
    from ApplicationServices import (
        AXUIElementCreateSystemWide,
        AXUIElementCopyAttributeValue,
        kAXFocusedUIElementAttribute,
        kAXSelectedTextAttribute,
        kAXPositionAttribute,
    )
    HAS_ACCESSIBILITY = True
except ImportError:
    HAS_ACCESSIBILITY = False

import subprocess

def get_selected_text_via_ax():
    """Accessibility API로 선택된 텍스트 가져오기"""
    try:
        system_element = AXUIElementCreateSystemWide()
        err, focused = AXUIElementCopyAttributeValue(
            system_element, kAXFocusedUIElementAttribute, None
        )
        if err != 0 or focused is None:
            return None

        err, selected = AXUIElementCopyAttributeValue(
            focused, kAXSelectedTextAttribute, None
        )
        if err != 0 or not selected:
            return None

        return str(selected)
    except Exception:
        return None

def get_selected_text_via_clipboard():
    """클립보드 폴백: 현재 클립보드 내용 반환"""
    try:
        result = subprocess.run(
            ['pbpaste'], capture_output=True, text=True, timeout=1
        )
        return result.stdout.strip() or None
    except Exception:
        return None

def main():
    prev_text = ''
    use_ax = HAS_ACCESSIBILITY

    while True:
        try:
            text = None

            if use_ax:
                text = get_selected_text_via_ax()

            if not text:
                # AX 실패 시 클립보드 모니터링
                text = get_selected_text_via_clipboard()

            if text and text != prev_text and len(text.strip()) > 0:
                prev_text = text
                output = json.dumps({
                    'type': 'selection',
                    'text': text,
                    'x': 0,
                    'y': 0,
                }, ensure_ascii=False)
                print(output, flush=True)

            time.sleep(0.3)

        except KeyboardInterrupt:
            break
        except Exception as e:
            err_output = json.dumps({'type': 'error', 'message': str(e)}, ensure_ascii=False)
            print(err_output, file=sys.stderr, flush=True)
            time.sleep(1)

if __name__ == '__main__':
    main()
