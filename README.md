# 검측요청서 생성기 (GitHub Pages)

브라우저에서 **검측요청서 + 검측요청결과통보**를 작성하고 PDF로 저장하는 정적 웹앱입니다.

## 기능
- 번호 자동 생성: `IR-YYYYMMDD-XXX` (날짜별 자동 증가 / 브라우저 localStorage 저장)
- 일시(요청일자) 선택
- **동 / 층 / 호** 각각 입력
- 요청서 + 결과통보를 같은 문서로 출력(PDF)

## 배포
- Settings → Pages → Source를 GitHub Actions로 설정
- 이후에는 커밋만 하면 자동 반영됩니다.
