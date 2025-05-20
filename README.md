# 이벤트/보상 관리 플랫폼

이 프로젝트는 메이플스토리 pc 백엔드 과제를 위한 이벤트/보상 관리 플랫폼입니다. 사용자 인증, 이벤트 관리, 보상 지급 등의 기능을 제공하며, 역할 기반 권한 관리 시스템을 통해 각 사용자 유형별로 적절한 권한을 부여합니다.

## 실행 방법

### 실행 전 체크할 부분

-   Docker 및 Docker Compose가 설치되어 있어야 합니다.
-   포트 충돌이 없어야 합니다 (기본 포트: 3000, 3001, 3002, 27017, 27018).

### 실행 단계

1. 프로젝트 루트 디렉토리에서 다음 명령어를 실행합니다:

```bash
docker compose up -d
```

2. 모든 서비스가 정상적으로 시작되면 다음 URL로 접근할 수 있습니다:
    - Gateway Server: http://localhost:3000
    - Auth Server: http://localhost:3001
    - Event Server: http://localhost:3002

### 상태 확인

각 서버의 상태는 다음 엔드포인트를 통해 확인할 수 있습니다:

```
GET /health
```

## 시스템 아키텍처

### 서버 구조

이 시스템은 세 개의 주요 서버로 구성되어 있습니다:

#### 1. Gateway Server

-   **역할**: 모든 API 요청의 진입점으로, 인증 및 권한 검사를 수행하고 적절한 서버로 요청을 라우팅합니다.
-   **주요 기능**:
    -   JWT 토큰 검증
    -   역할 기반 권한 검사
    -   요청 라우팅
    -   헬스 체크
-   **기술 스택**: NestJS, Passport.js

#### 2. Auth Server

-   **역할**: 사용자 인증 및 권한 관리를 담당합니다.
-   **주요 기능**:
    -   사용자 등록 및 로그인
    -   스태프(운영자, 감사자, 관리자) 등록 및 로그인
    -   JWT 토큰 발급
    -   역할 및 권한 관리
-   **기술 스택**: NestJS, MongoDB, JWT

#### 3. Event Server

-   **역할**: 이벤트, 보상, 보상 요청 관리를 담당합니다.
-   **주요 기능**:
    -   이벤트 생성 및 관리
    -   보상 정의 및 관리
    -   보상 요청 처리
    -   출석 체크 관리
-   **기술 스택**: NestJS, MongoDB

### 데이터베이스 구조

시스템은 두 개의 MongoDB 데이터베이스를 사용합니다:

#### 1. auth-database

-   **역할**: 사용자 정보, 인증 및 권한 관련 데이터 저장
-   **주요 컬렉션**:

    -   **users**: 일반 사용자 정보 저장

        -   username: 사용자 이름 (고유)
        -   password: 암호화된 비밀번호
        -   isActive: 계정 활성화 상태
        -   createdAt/updatedAt: 생성/수정 시간

    -   **staffs**: 운영 스태프 정보 저장

        -   username: 스태프 이름 (고유)
        -   password: 암호화된 비밀번호
        -   role: 역할 (ADMIN, OPERATOR, AUDITOR)
        -   isActive: 계정 활성화 상태
        -   createdAt/updatedAt: 생성/수정 시간

    -   **permissions**: 역할별 권한 정보 저장
        -   role: 역할 (USER, ADMIN, OPERATOR, AUDITOR)
        -   permissions: 권한 목록 (리소스:액션 형식)

#### 2. event-database

-   **역할**: 이벤트, 보상, 보상 요청 관련 데이터 저장
-   **주요 컬렉션**:

    -   **events**: 이벤트 정보 저장

        -   name: 이벤트 이름
        -   description: 이벤트 설명
        -   startDate/endDate: 이벤트 시작/종료 일시
        -   status: 이벤트 상태 (ACTIVE, INACTIVE, ENDED)
        -   provideBy: 보상 지급 방식 (MANUAL, AUTO)
        -   condition: 이벤트 조건 (타입 및 세부 조건)
        -   createdAt/updatedAt: 생성/수정 시간

    -   **rewards**: 보상 정보 저장

        -   type: 보상 유형 (POINT, ITEM, COUPON)
        -   targetId: 보상 대상 ID
        -   quantity: 수량
        -   description: 보상 설명
        -   properties: 보상 속성 (아이템 레벨, 쿠폰 코드 등)
        -   isLimitedTime: 기간 제한 여부
        -   availableUntil: 사용 가능 기간
        -   event: 연결된 이벤트 ID
        -   createdAt/updatedAt: 생성/수정 시간

    -   **request-rewards**: 보상 요청 정보 저장

        -   user: 요청 사용자 ID
        -   requestedAt: 요청 시간
        -   result: 요청 결과 (SUCCESS, FAIL, PENDING)
        -   failReason: 실패 이유 (조건 미충족, 이벤트 만료 등)
        -   message: 결과 메시지
        -   event: 연결된 이벤트 ID
        -   rewards: 지급된 보상 ID 목록
        -   conditionSnapshot: 요청 시점의 조건 상태
        -   isProcessed: 처리 완료 여부
        -   processedAt: 처리 시간
        -   createdAt/updatedAt: 생성/수정 시간

    -   **attendances**: 출석 체크 정보 저장
        -   user: 사용자 ID
        -   date: 출석 일자
        -   createdAt: 생성 시간

## 통신 방식

### 서버 간 통신

-   **Gateway Server → Auth/Event Server**: HTTP 기반 REST API 통신
-   **환경 변수를 통한 서버 URL 설정**:
    -   Gateway Server는 AUTH_SERVER_URL, EVENT_SERVER_URL 환경 변수를 통해 각 서버의 URL을 설정
    -   Auth/Event Server는 GATEWAY_SERVER_URL 환경 변수를 통해 Gateway Server의 URL을 설정

### API 요청 흐름

1. 클라이언트가 Gateway Server로 요청 전송
2. Gateway Server에서 JWT 토큰 검증 및 권한 확인
3. 요청을 적절한 서버(Auth/Event)로 라우팅
4. 대상 서버에서 비즈니스 로직 처리 후 응답
5. Gateway Server가 응답을 클라이언트에게 전달

## 권한 관리 시스템

### 역할 기반 접근 제어 (RBAC)

시스템은 역할 기반 접근 제어를 통해 사용자 권한을 관리합니다. 각 역할은 특정 리소스에 대한 특정 액션을 수행할 수 있는 권한 집합을 가집니다.

### 역할 정의

-   **USER**: 일반 사용자, 보상 요청 및 자신의 요청 조회 가능
-   **OPERATOR**: 운영자, 이벤트 및 보상 등록/관리 가능
-   **AUDITOR**: 감사자, 보상 이력 조회만 가능
-   **ADMIN**: 관리자, 모든 기능에 접근 가능

### 권한 형식

권한은 `리소스:액션` 형식으로 정의됩니다:

-   **리소스**: event, reward, request_reward
-   **액션**: create, read, update, delete, read_own

### 권한 매핑

각 역할에 대한 권한 매핑은 다음과 같습니다:

#### USER

-   event:read
-   reward:read
-   request_reward:create
-   request_reward:read_own

#### AUDITOR

-   event:read
-   reward:read
-   request_reward:read

#### OPERATOR

-   event:read
-   event:create
-   event:update
-   reward:read
-   reward:create
-   reward:update
-   request_reward:read

#### ADMIN

-   event:create
-   event:read
-   event:update
-   event:delete
-   reward:create
-   reward:read
-   reward:update
-   reward:delete
-   request_reward:create
-   request_reward:read
-   request_reward:update
-   request_reward:delete

## 설계 의도 및 이점

### 역할 기반 권한 관리

-   **예상 문제**: 하드코딩된 권한 체계는 새로운 역할 추가나 권한 변경 시 코드 수정과 재배포가 필요하며, 권한 관리의 복잡성이 증가합니다.
-   **설계 의도**: 데이터베이스 기반의 유연한 권한 관리 시스템을 구축하여 운영 중 권한 변경이나 새로운 역할 추가를 용이하게 합니다.
-   **이점**:
    -   코드 변경 없이 새로운 역할 추가 가능 (permissions 컬렉션에 새 역할 추가)
    -   운영 중 권한 변경 용이 (역할에 연결된 권한 목록 수정)
    -   세분화된 접근 제어로 보안성 강화 (리소스와 액션 단위로 권한 정의)
    -   권한 관리의 중앙화로 일관성 유지 및 감사 용이

### 이벤트 조건 및 보상 유연성

-   **예상 문제**: 고정된 이벤트 유형과 보상 체계는 새로운 마케팅 전략이나 이벤트 시나리오 구현 시 개발자 의존도가 높아지고 출시 지연이 발생합니다.
-   **설계 의도**: 확장 가능한 이벤트 조건 및 보상 구조를 설계하여 다양한 비즈니스 요구사항에 유연하게 대응합니다.
-   **이점**:
    -   최소한의 코드 변경으로 새로운 이벤트 유형 추가 가능 (EventConditionType 확장)
    -   다양한 보상 유형 지원으로 마케팅 전략 다변화 (RewardType 확장)
    -   복잡한 이벤트 조건 정의 가능 (condition 필드의 유연한 구조)
    -   비즈니스 요구사항 변화에 빠른 대응 가능

### 보상 요청 처리 자동화

-   **예상 문제**: 수작업 보상 지급은 운영 리소스 소모가 크고, 처리 지연 및 인적 오류 가능성이 높습니다.
-   **설계 의도**: 보상 요청 처리 프로세스를 자동화하여 운영 효율성을 높이고 사용자 경험을 개선합니다.
-   **이점**:
    -   조건 충족 여부 자동 검증으로 운영 리소스 절감
    -   중복 보상 요청 방지로 시스템 신뢰성 향상
    -   요청 상태 추적 및 감사 기능으로 투명성 확보
    -   신속한 보상 지급으로 사용자 만족도 향상

## 확장 가능성

### 새로운 역할 추가

-   **현재 한계**: 기본 역할(USER, OPERATOR, AUDITOR, ADMIN)만으로는 세분화된 운영 체계를 구현하기 어렵습니다.
-   **확장 방법**:
    1. auth-database의 permissions 컬렉션에 새 역할과 권한 목록 추가
    2. Auth Server의 ROLE enum에 새 역할 추가
    3. 필요시 Gateway Server의 권한 검증 로직 수정
-   **기대 효과**: 조직 구조 변화나 운영 프로세스 개선에 유연하게 대응할 수 있습니다.

### 새로운 이벤트 유형 추가

-   **현재 한계**: 사전 정의된 이벤트 유형만으로는 다양한 마케팅 전략이나 사용자 참여 유도 방안을 구현하기 어렵습니다.
-   **확장 방법**:
    1. event-database의 EventConditionType enum에 새 이벤트 유형 추가
    2. Event Server에 새 이벤트 유형에 대한 조건 검증 로직 구현
    3. 필요시 새 이벤트 유형에 맞는 UI 컴포넌트 개발

### 새로운 보상 유형 추가

-   **현재 한계**: 기본 보상 유형(POINT, ITEM, COUPON)만으로는 다양한 인센티브 전략을 구현하기 어렵습니다.
-   **확장 방법**:
    1. event-database의 RewardType enum에 새 보상 유형 추가
    2. Event Server에 새 보상 유형에 대한 처리 로직 구현
    3. 필요시 새 보상 유형에 맞는 UI 컴포넌트 개발
-   **기대 효과**: 새로운 비즈니스 목표에 맞는 다양한 보상 체계를 구현할 수 있습니다.

## 향후 확장 계획

현재 시스템의 기본 아키텍처를 유지하면서 다음과 같은 기능 확장을 계획하고 있습니다:

### 1. 이벤트 제약 사항 확장

-   **구현 내용**:

    -   시간대별 참여 제한 (특정 시간에만 이벤트 참여 가능)
    -   지역별 이벤트 제한 (특정 지역 사용자만 참여 가능)
    -   사용자 세그먼트 기반 제한 (신규 사용자, VIP 사용자 등 특정 그룹만 참여 가능)
    -   디바이스 타입 제한 (모바일/웹 전용 이벤트)

### 2. 큐 시스템 도입을 통한 분산 처리

-   **구현 내용**:

    -   BullMQ 또는 Kafka 같은 메시지 큐 시스템 도입
    -   보상 요청 처리를 비동기 방식으로 전환
    -   워커 서비스 추가로 보상 처리 작업 분산
    -   재시도 메커니즘 구현

-   **예상 문제**: 인기 이벤트 시 동시에 많은 보상 요청이 발생하면 시스템 과부하 발생 가능성이 있습니다.

-   **도입 이점**:
    -   시스템 안정성 향상 (트래픽 피크 시에도 안정적 운영)
