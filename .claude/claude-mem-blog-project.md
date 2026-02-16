# MCP 서버 상태 보고서

**날짜**: 2026년 2월 16일
**목적**: Claude Code에서 MCP 서버 동작 상태 확인

---

## 1. MCP 서버 상태 요약

| 서비스 | 포트 | PID | 상태 |
|--------|------|-----|------|
| Chroma DB | 8000 | 106010 | ✅ 실행 중 |
| Worker Service | 37777 | 108376 | ✅ 실행 중 |
| MCP Server | - | - | ✅ 연결됨 |

---

## 2. 문제 및 해결 과정

### 발생한 문제
Chroma DB가 실행 중지되어 claude-mem 플러그인의 저장/검색 기능이 작동하지 않음

```
Error calling Worker API: Worker API error (500):
{"error":"Chroma connection failed: Chroma server not reachable.
Ensure worker started correctly."}
```

### 해결 과정

#### 단계 1: Chroma DB 시작 방법 찾기
- `chroma-run` 명령 없음
- `python -m chroma.cli` 모듈 없음
- 정확한 명령: `python3 -c "from chromadb.cli.cli import app; import sys; sys.argv = ['chroma', 'run', '--path', '.', '--host', '127.0.0.1', '--port', '8000']; app()"`

#### 단계 2: HuggingFace 모델 오류 해결
- 문제: `Load model from .../all-MiniLM-L6-v2/onnx/model.onnx failed: Protobuf parsing failed.`
- 해결: 손상된 모델 캐시 삭제 후 Worker Service 재시작

#### 단계 3: start-chroma.sh 스크립트 수정
- 이전: `/usr/bin/python3 -m chroma.cli`
- 수정 후: `/usr/bin/python3 -c "from chromadb.cli.cli import app; ..."`

---

## 3. claude-mem 기능 테스트 결과

### 저장 기능 (save_memory)
- **상태**: ✅ 정상
- **테스트 결과**: Observation #272로 저장 성공
- **응답**: `"success": true`

### 검색 기능 (search)
| 쿼리 | 결과 | 상태 |
|------|------|------|
| `테스트 메모리` | 6개 결과 찾음 | ✅ |
| `Chroma DB MCP 서버` | 9개 결과 찾음 | ✅ |
| `블로그 프로젝트` | 9개 결과 찾음 | ✅ |

### 상세 조회 (get_observations)
- **상태**: ✅ 정상
- **테스트**: Observation #272 전체 데이터 반환 성공

---

## 4. 확인된 MCP 서버 목록

### 활성화된 MCP 서버
- **claude-mem**: ✅ 저장/검색 기능 정상
- **zep-docs**: ✅ 문서 리소스 접근 가능
- **duckduckgo-search**: ✅ iask-search, monica-search, web-search
- **naver-search-mcp**: ✅ 블로그, 뉴스, 쇼핑, 백과 검색
- **web-reader**: ✅ 웹 페이지 읽기
- **web-search-prime**: ✅ 웹 검색
- **4.5v-mcp**: ✅ 이미지 분석

---

## 5. 유지 관리 명령어

### Chroma DB 시작
```bash
bash ~/.claude-mem/start-chroma.sh
```

### 포트 확인
```bash
netstat -tlnp | grep -E "(8000|37777)"
```

### Worker Service 재시작
```bash
# PID 확인 후
kill <PID>
# 재시작
bun ~/.claude/plugins/marketplaces/thedotmack/plugin/scripts/worker-service.cjs
```

### 모델 캐시 삭제 (오류 발생 시)
```bash
rm -rf ~/.claude/plugins/marketplaces/thedotmack/node_modules/@huggingface/transformers/.cache/Xenova/all-MiniLM-L6-v2
```

---

## 6. 설정 파일 위치

| 파일 | 경로 |
|------|------|
| MCP 설정 | `~/.claude/mcp.json` |
| claude-mem 설정 | `~/.claude-mem/settings.json` |
| Chroma 시작 스크립트 | `~/.claude-mem/start-chroma.sh` |
| Worker 로그 | `~/.claude-mem/worker.log` |
| Chroma 데이터 | `~/.claude-mem/vector-db/` |

---

## 7. 결론

**모든 MCP 서비스가 정상 작동 중입니다.**

- Chroma DB와 Worker Service가 모두 실행 중
- claude-mem의 저장, 검색, 상세 조회 기능 모두 정상
- 다양한 MCP 서버가 활성화되어 있어 웹 검색, 이미지 분석, 문서 읽기 등의 기능 사용 가능

---

*보고서 생성: 2026년 2월 16일*
