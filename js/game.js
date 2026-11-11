const COLS=7,ROWS=16,$=i=>document.getElementById(i);
// 타워: c가격 d공격력 r사거리 cd쿨다운 t(A대공/G대지만) tech(속성 테크 전용) x(설명)
const T=[
{id:'wall',n:'새 둥지 벽',c:20,d:0,r:0,cd:9,ic:'🪺',col:0x78350f},
{id:'egg',n:'알 새총',c:100,d:23,r:2.8,cd:.65,ic:'🏹',col:0x3b82f6},
{id:'air',n:'깃털 대공',c:130,d:61,r:4.2,cd:.55,t:'A',ic:'🪶',col:0x06b6d4},
{id:'acorn',n:'도토리 중포',c:140,d:55,r:3,cd:.95,t:'G',ic:'🌰',col:0xd97706},
{id:'snack',n:'과자 뿌리개',c:150,d:0,r:3.2,cd:4,snack:3,ic:'🍤',col:0xf59e0b,x:'4초마다 과자 3개 살포 · 공중 새가 1초간 내려와 먹어요(그동안 지상 판정)'},
{id:'pylon',n:'참새 전봇대',c:90,d:25,r:1,cd:.25,pylon:1,ic:'🔗',col:0xfde047,x:'이어 지으면 전깃줄 · 공중 ×2.4(줄 위) · 지상 ×0.8(줄 옆 1칸) · 연결 많을수록 최대 3배'},
{id:'cctv',n:'부엉이 CCTV',c:220,d:0,r:3.5,cd:1,cctv:1,ic:'📹',col:0x8b5cf6,x:'은신 감지 반경 3.5칸(강화 시 +0.25) · 은신 새를 처음 목격하거나 4분 이후 해금 · 최대 2개'},
{id:'net',n:'잠자리채 그물포',c:170,d:40,r:4.2,cd:1.1,splash:1.2,slow:1,t:'A',ic:'🥅',col:0x22d3ee,x:'공중 전용 · 광역 그물 + 감속'},
{id:'ember',tech:'fire',n:'불씨 둥지',c:150,d:23,r:2.8,cd:.7,burn:10,ic:'🔥',col:0xf97316,x:'화상'},
{id:'lava',tech:'fire',n:'용암 분화구',c:260,d:24,r:3,cd:1.5,splash:1.3,burn:14,t:'G',ic:'🌋',col:0xdc2626,x:'광역 화상'},
{id:'sun',tech:'fire',n:'태양 등대',c:420,d:176,r:5,cd:2.2,ic:'☀️',col:0xfacc15,x:'초장거리 강타'},
{id:'ice',tech:'ice',n:'얼음 알',c:160,d:15,r:2.6,cd:.9,slow:1,ic:'❄️',col:0xa855f7,x:'감속'},
{id:'frost',tech:'ice',n:'서리 결정',c:240,d:55,r:3,cd:.9,freeze:.3,ic:'💎',col:0x67e8f9,x:'30% 빙결'},
{id:'bliz',tech:'ice',n:'눈보라 탑',c:380,d:14,r:3.2,cd:1.6,self:1,slow:1,ic:'🌨️',col:0xe0f2fe,x:'주변 전체 감속'},
{id:'static',tech:'thunder',n:'정전기 깃',c:180,d:24,r:3,cd:.8,chain:3,ic:'✨',col:0xfde047,x:'3연쇄'},
{id:'thunder',tech:'thunder',n:'천둥 번개',c:320,d:60,r:3.5,cd:1.8,stun:1,ic:'⚡',col:0xfacc15,x:'기절'},
{id:'storm',tech:'thunder',n:'뇌운',c:440,d:61,r:3.6,cd:1.6,chain:5,stun:.5,ic:'🌩️',col:0x818cf8,x:'5연쇄+기절'},
{id:'breeze',tech:'wind',n:'산들 풍차',c:150,d:14,r:2.8,cd:1.1,kb:1,ic:'🎐',col:0x5eead4,x:'넉백'},
{id:'wind',tech:'wind',n:'비눗방울 기계',c:330,d:30,r:3.4,cd:1.4,bubble:1.4,ic:'🧼',col:0x7dd3fc,x:'비눗방울에 가둬 1.4초 둥실 · 갇힌 새는 멈추고 공중으로 떠서 대공 타워에도 맞아요 · 터질 때 공격력 2배 피해 · 넉백 면역 새는 안 갇혀요'},
{id:'twister',tech:'wind',n:'회오리 대공',c:300,d:135,r:4.5,cd:.8,t:'A',kb:1,ic:'🌀',col:0x0ea5e9,x:'강력 대공+넉백'},
{id:'bat',n:'박쥐 둥지',c:180,d:28,r:3,cd:.7,ic:'🦇',col:0x9f1239,x:'박쥐 떼가 날아가 쪼아요(공용)'},
{id:'flu',tech:'dark',n:'독감 물약',c:240,d:16,r:3.2,cd:1.6,splash:1.4,poison:8,ic:'🧪',col:0x22c55e,x:'광역 독'},
{id:'flytrap',tech:'dark',n:'꿀꺽 파리지옥',c:260,d:34,r:2.6,cd:1.4,trap:1,poison:6,t:'G',ic:'🪴',col:0x65a30d,x:'지상 새를 덥석 물어 묶고 독 · 업그레이드마다 머리 +1(최대 3) · Lv.4 꿀꺽(체력 12% 이하 삼킴)',fl:'“입 냄새는 좀 나도, 한 번 물면 안 놔줘요. 다 먹으면 퉤!”'},
{id:'acid',tech:'dark',n:'산성 늪',c:300,d:18,r:3,cd:1.3,splash:1.6,amp:1,poison:5,t:'G',ic:'🫧',col:0x84cc16,x:'받는 피해 +35%'},
// ✨ 조합 타워 (두 속성을 모두 고르면 해금)
{id:'steam',combo:['fire','ice'],n:'증기 간헐천',c:360,d:54,r:3.2,cd:1.4,splash:1.6,burn:12,slow:1,ic:'♨️',col:0xfda4af,x:'광역 화상+감속'},
{id:'plasma',combo:['fire','thunder'],n:'플라즈마 포',c:420,d:105,r:3.6,cd:1.3,chain:4,burn:10,ic:'🔆',col:0xfb923c,x:'4연쇄 화상'},
{id:'firestorm',combo:['fire','wind'],n:'화염 회오리',c:400,d:24,r:3.2,cd:1.5,self:1,burn:12,kb:1,ic:'🎇',col:0xf43f5e,x:'주변 화상+넉백'},
{id:'pyre',combo:['fire','dark'],n:'독불 화로',c:380,d:48,r:3.2,cd:1.3,splash:1.7,burn:12,poison:10,amp:1,t:'G',ic:'⚗️',col:0xa3e635,x:'화상+독+약화'},
{id:'aurora',combo:['ice','thunder'],n:'빙뢰 첨탑',c:420,d:100,r:3.5,cd:1.2,chain:4,freeze:.35,ic:'🌌',col:0x93c5fd,x:'4연쇄+35% 빙결'},
{id:'whiteout',combo:['ice','wind'],n:'눈폭풍 소용돌이',c:400,d:6,r:3.4,cd:1.4,self:1,slow:1,kb:1,ic:'🌬️',col:0xccfbf1,x:'주변 감속+넉백'},
{id:'frostbane',combo:['ice','dark'],n:'독빙 결정',c:380,d:36,r:3,cd:1,splash:1.2,poison:10,freeze:.25,slow:1,ic:'🧊',col:0x5eead4,x:'독+감속+빙결'},
{id:'tempest',combo:['thunder','wind'],n:'폭풍 번개탑',c:440,d:72,r:4,cd:1.2,chain:4,kb:1,ic:'🗼',col:0xa5b4fc,x:'4연쇄+넉백'},
{id:'venomvolt',combo:['thunder','dark'],n:'맹독 전류',c:400,d:56,r:3.4,cd:1.1,chain:3,poison:8,amp:1,ic:'🔋',col:0xbef264,x:'3연쇄 독+약화'},
{id:'miasma',combo:['wind','dark'],n:'독안개 풍차',c:380,d:10,r:3.4,cd:1.2,self:1,poison:9,kb:1,ic:'🌫️',col:0x86efac,x:'주변 독+넉백'}];
// 유닛: c가격 hp sp속도 t(G지상/A공중) dm탈출피해 inc인컴 x(특수 능력)
const U=[
{id:'egg_legs',n:'다리 알',c:60,hp:80,sp:1.4,t:'G',dm:1,inc:3,ic:'🥚',col:0xfef08a},
{id:'kiwi',n:'키위새',c:80,hp:110,sp:1.3,t:'G',dm:1,inc:4,ic:'🥝',col:0x92400e},
{id:'chick',n:'병아리',c:100,hp:130,sp:1.6,t:'G',dm:1,inc:5,ic:'🐥',col:0xfde047},
{id:'turkey',n:'칠면조',c:140,hp:140,sp:1.2,t:'G',dm:1,inc:10,ic:'🦃',col:0x5b3a29,x:'몸은 약하지만 인컴이 높아요'},
{id:'rooster',n:'수탉',c:180,hp:218,sp:2.2,t:'G',dm:1,inc:9,ic:'🐔',col:0xf8fafc},
{id:'pigeon',n:'비둘기',c:200,hp:182,sp:2.4,t:'A',dm:1,inc:10,ic:'🕊️',col:0x94a3b8},
{id:'goose',n:'거위',c:220,hp:377,sp:1.2,t:'G',dm:1,inc:11,split:2,ic:'🪿',col:0xf5f5f4,x:'쓰러지면 다리 알 2개로 분열'},
{id:'parrot',n:'앵무새',c:240,hp:170,sp:1.9,t:'A',dm:1,inc:11,ic:'🦜',col:0x43a047,sulk:1,talk:['이 삐-! 타워야!','삐-삐-! 비켜라!','니 미로 꼬라지 삐-!'],x:'욕쟁이: 2.2초마다 근처 타워 하나에 욕을 해서 1.5초 삐지게 해요(공격 멈춤)'},
{id:'crow',n:'까마귀',c:260,hp:221,sp:1.9,t:'A',dm:1,inc:13,stealth:.5,ic:'🐦‍⬛',col:0x4a4463,x:'진영 절반까지 은신'},
{id:'pirate',n:'북극해적갈매기',c:280,hp:341,sp:1.7,t:'A',dm:1,inc:12,steal:6,ic:'🏴‍☠️',col:0x6b5444,x:'탈출 시 내 인컴 +6'},
{id:'duck',n:'청둥오리',c:300,hp:747,sp:1,t:'G',dm:3,inc:16,ic:'🦆',col:0x9a8f7e},
{id:'woodpecker',n:'딱따구리',c:320,hp:450,sp:1.5,t:'G',dm:2,inc:16,peck:1,ic:'🪵',col:0x1f2937,x:'근처 타워를 쪼아 2초 마비'},
{id:'seagull',n:'폭격갈매기',c:360,hp:320,sp:1.3,t:'A',dm:2,inc:20,poop:1,ic:'🪽',col:0xe2e8f0,x:'똥 폭격: 2.5초마다 아래 타워에 똥 → 3초 동안 공격이 느려져요(×1.6)'},
{id:'swan',n:'백조',c:380,hp:377,sp:1.3,t:'A',dm:2,inc:19,shield:580,ic:'🦢',col:0xffffff,x:'보호막(체력 400 추가) · 보호막 동안 독·화상·감속 면역 · ⚡번개에 약함'},
{id:'penguin',n:'황제펭귄',c:400,hp:390,sp:1.2,t:'G',dm:1,inc:22,count:3,imm:['slow'],tech:'ice',ic:'🐧',col:0x3f4d6e,x:'3마리 무리 · 감속 면역'},
{id:'vampire',n:'흡혈박쥐새',c:420,hp:490,sp:1.5,t:'A',dm:2,inc:22,drain:2,tech:'dark',ic:'🦇',col:0x8b2f45,x:'탈출 시 내 라이프 +2'},
{id:'peacock',n:'공작',c:460,hp:720,sp:1.1,t:'G',dm:2,inc:24,heal:1,ic:'🦚',col:0x1d6fd8,x:'주변 아군 치유'},
{id:'dodo',n:'도도새',c:500,hp:1400,sp:.8,t:'G',dm:4,inc:30,ic:'🦤',col:0x7a4e2d,talk:['죽지도 않고 또 왔네!','얼씨구씨구 들어간다~','절씨구씨구 들어간다~'],extinct:2,x:'멸종 거부: 쓰러지면 30% 확률로 체력 30%로 벌떡(최대 2번) · 각설이 타령'},
{id:'falcon',n:'송골매',c:560,hp:504,sp:3.4,t:'A',dm:3,inc:30,dodge:.3,ic:'💨',col:0x78716c,x:'과속 매: 공격을 30% 피해요 · 🦉CCTV 범위에선 과속 단속(못 피함, 수비 쪽 벌금 +15G)'},
{id:'albatross',n:'알바트로스',c:620,hp:770,sp:2.6,t:'A',dm:3,inc:36,imm:['kb'],tech:'wind',ic:'🌊',col:0xe0f2fe,x:'넉백 면역 · 고속'},
{id:'owl',n:'올빼미',c:680,hp:700,sp:.85,t:'G',dm:3,inc:40,shield:900,coffee:1,ic:'🦉',col:0x8d6e4c,x:'야근 중(지상): 느리지만 보호막이 커요 · 4초마다 커피 한 모금 ☕ 보호막 25% 회복 · 보호막 동안 독·화상·감속 면역 · ⚡번개에 약함'},
{id:'thunderbird',mat:'elec',n:'천둥새',c:700,hp:990,sp:1.8,t:'A',dm:3,inc:40,imm:['stun'],zap:1,tech:'thunder',ic:'⛈️',col:0x4338ca,x:'기절 면역 · 근처 타워 마비'},
{id:'eagle',n:'제왕독수리',c:850,hp:1690,sp:1,t:'A',dm:4,inc:52,wig:1,ic:'🦅',col:0x6b4f3a,x:'가발 날리기: 체력 절반이 되면 가발이 날아가고, 번쩍이는 머리에 근처 타워가 2초 눈부심(공격 멈춤)'},
{id:'phoenix',mat:'fire',n:'불사조',c:1300,hp:1950,sp:1.4,t:'A',dm:6,inc:85,revive:1,tech:'fire',ic:'🔥',col:0xf97316,x:'한 번 부활'},
{id:'humbee',n:'벌새',c:360,hp:125,sp:1.9,t:'G',dm:1,inc:19,count:6,cntR:[5,7],swarm:1,ic:'🐝',col:0xfacc15,x:'5~7마리 떼 · 너무 작아서 강타형 타워(공격 간격 1.5초 이상)의 피해를 절반만 받아요'},
{id:'pelican',n:'펠리컨',c:3000,hp:5200,sp:.8,t:'A',dm:10,inc:190,carry:8,ic:'🚌',col:0xf8fafc,x:'쓰러지면 부리 주머니에서 승객 새 8마리가 쏟아져 지상으로 걸어가요'},
{id:'demcrane',n:'철거반장 두루미',c:4800,hp:8200,sp:.75,t:'G',dm:14,inc:250,grab:1,ic:'🏗️',col:0xf1f5f9,talk:['이거 불법 건축물이에요~','철거 들어갑니다!','민원 접수됐습니다'],x:'6초마다 멈춰서 근처 타워를 부리로 집어 4초 동안 머리에 이고 걸어가요(그동안 공격 불가). Lv.2 이하는 근처 빈칸으로 옮겨 놓고(미로는 절대 안 막아요), 더 높거나 빈칸이 없으면 제자리에 돌려놔요'},
{id:'archaeo',n:'시조새',c:5500,hp:8600,sp:.75,t:'A',dm:21,inc:330,fossil:1,stone:1,ic:'🦖',col:0xa8a08f,talk:['요즘 타워는 처음 보네…','1억 5천만 년 만의 외출!','깃털… 내 깃털…'],x:'체력이 절반이 되면 화석이 깨지며 땅에 쿵! 착지해요(주변 타워 2초 기절). 그 뒤로는 공룡처럼 땅으로 달려요'},
{id:'archaeo_g',hidden:1,n:'갓 깨어난 시조새',c:5500,hp:8600,sp:1.05,t:'G',dm:21,inc:0,stone:2,ic:'🦖',col:0x0f9488,x:'화석 껍질을 깨고 나와 공룡처럼 땅으로 달려요'},
{id:'crocbird',n:'악어새',c:1600,hp:3300,sp:.75,t:'G',dm:6,inc:110,rage:1,ic:'🐊',col:0xb8bec9,x:'악어를 타고 와요 · 체력이 35% 아래로 떨어지면 악어가 화나서 1.6배 빨라져요'},
{id:'ostrich',n:'타조타이탄',c:1900,hp:4500,sp:.7,t:'G',dm:8,inc:130,ic:'🦩',col:0x292524,leap:8,x:'그랑 주떼: 8초마다 길을 따라 2칸 반을 훌쩍 점프 · 착지하면 주변 타워 0.6초 흔들림'},
// ✨ 조합 새
{id:'crane',combo:['fire','ice'],n:'온천 두루미',c:650,hp:900,sp:1.4,t:'G',dm:3,inc:38,imm:['slow','burn'],heal:1,ic:'🌡️',col:0xfecdd3,x:'화상·감속 면역 · 주변 치유'},
{id:'plasmabird',combo:['fire','thunder'],n:'번개불새',c:900,hp:935,sp:2.3,t:'A',dm:4,inc:55,zap:1,imm:['stun'],ic:'🌟',col:0xfb923c,x:'기절 면역 · 타워 마비 · 고속'},
{id:'comet',combo:['fire','wind'],n:'혜성 매',c:700,hp:510,sp:3.6,t:'A',dm:3,inc:42,shield:425,imm:['kb'],ic:'☄️',col:0xf43f5e,x:'보호막(독·화상·감속 면역, ⚡번개에 약함) · 넉백 면역 · 초고속'},
{id:'plague',combo:['fire','dark'],n:'역병 까마귀',c:600,hp:300,sp:1.8,t:'A',dm:3,inc:36,stealth:.75,split:2,ic:'🦠',col:0x5a7a2e,x:'3/4까지 은신 · 분열'},
{id:'auroraowl',combo:['ice','thunder'],n:'오로라 올빼미',c:850,hp:1105,sp:2,t:'A',dm:4,inc:50,imm:['stun','slow'],shield:340,ic:'🌠',col:0x93c5fd,x:'기절·감속 면역 · 보호막(독·화상 면역, ⚡번개에 약함)'},
{id:'blizgull',combo:['ice','wind'],n:'눈보라 갈매기',c:600,hp:630,sp:2.2,t:'A',dm:3,inc:36,count:2,imm:['kb','slow'],ic:'⛄',col:0xf0fdfa,x:'2마리 · 넉백·감속 면역'},
{id:'frostpeng',mat:'ice',combo:['ice','dark'],n:'빙독 펭귄',c:550,hp:352,sp:1.3,t:'G',dm:1,inc:33,count:4,imm:['slow','poison'],ic:'🥶',col:0x9a8fe8,x:'4마리 무리 · 감속·독 면역'},
{id:'stormeagle',combo:['thunder','wind'],n:'폭풍 독수리',c:1000,hp:1530,sp:1.8,t:'A',dm:5,inc:62,imm:['stun','kb'],ic:'💫',col:0x6366f1,x:'기절·넉백 면역'},
{id:'voltbat',mat:'elec',combo:['thunder','dark'],n:'전기 박쥐',c:750,hp:880,sp:1.9,t:'A',dm:3,inc:45,drain:3,zap:1,ic:'🔌',col:0x5f8f1f,x:'타워 마비 · 라이프 흡수 3'},
{id:'ghostcrow',mat:'ghost',combo:['wind','dark'],n:'유령 까마귀',c:700,hp:488,sp:2.2,t:'A',dm:3,inc:42,stealth:.7,imm:['kb'],ic:'👻',col:0x94a3b8,x:'진영 70%까지 은신 · 넉백 면역'},
// 🥚 수상한 알 연구소: 부화 병아리(상점에 없음, hidden) + 전설의 새(누적 100알 해금, secret)
{id:'hatch_chick',hidden:1,n:'갓깬 삐약이',c:60,hp:200,sp:1.7,t:'G',dm:1,inc:0,ic:'🐣',col:0xfde68a,x:'알에서 막 깨어났어요'},
{id:'hatch_fire',hidden:1,n:'맥반석 병아리',c:60,hp:260,sp:2,t:'G',dm:1,inc:0,imm:['burn'],ic:'🍳',col:0xfb923c,x:'화상 면역 · 빠름'},
{id:'hatch_ice',hidden:1,n:'아이스 병아리',c:60,hp:300,sp:1.6,t:'G',dm:1,inc:0,imm:['slow'],ic:'🍦',col:0xbae6fd,x:'감속 면역'},
{id:'hatch_thunder',hidden:1,n:'찌릿 병아리',c:60,hp:260,sp:1.8,t:'G',dm:1,inc:0,imm:['stun'],zap:1,ic:'🔋',col:0xfef08a,x:'기절 면역 · 타워 마비'},
{id:'hatch_wind',hidden:1,n:'풍선 병아리',c:60,hp:220,sp:1.8,t:'A',dm:1,inc:0,imm:['kb'],ic:'🎈',col:0x5eead4,x:'둥실 날아가요 · 넉백 면역'},
{id:'hatch_dark',hidden:1,n:'방귀 병아리',c:60,hp:260,sp:1.7,t:'G',dm:1,inc:0,imm:['poison'],stealth:.8,ic:'💨',col:0xa3e635,x:'독 면역 · 냄새로 은신'},
{id:'hatch_gold',hidden:1,n:'황금 병아리',c:120,hp:280,sp:1.9,t:'G',dm:1,inc:0,steal:4,ic:'🌟',col:0xfacc15,x:'탈출하면 내 인컴 +4'},
{id:'hatch_dino',hidden:1,n:'티라노 병아리',c:400,hp:2500,sp:.9,t:'G',dm:4,inc:0,ic:'🦖',col:0x65a30d,x:'고대 유전자가 깨어났어요'},
{id:'eggchief',secret:'chief',n:'알통 대장닭',c:1600,hp:1800,sp:.9,t:'G',dm:5,inc:110,lay:1,ic:'🎩',col:0xfef3c7,x:'걸으며 3초마다 수상한 알을 낳아요 (한 판에 알 100개 보내면 해금)'}];
// ---------- 🏰 종족전: 오리지널 새 종족 4종 (전용 타워 2 + 전용 새 2 + 고유 특성) ----------
const RACE={
 nest:{n:'둥지 연합',ic:'🏰',col:'#60a5fa',c3:0x60a5fa,tag:'균형 · 건설',
  fl:'“벽을 쌓고 종을 울려라. 우리 둥지는 월세 한 번 밀린 적 없다!”',
  d:'튼튼한 둥지로 버티는 균형형 종족이에요.',p:'강화 비용 -30% · 철거 환급 90% · 타워 가격 -12%',
  upc:.7,ref:.9,tc:.88,ban:['pirate','woodpecker']},
 raptor:{n:'맹금 군단',ic:'🦅',col:'#f87171',c3:0xf87171,tag:'돌격 · 약탈',
  fl:'“먼저 날고 먼저 먹는다. 남의 진영은 우리 사냥터!”',
  d:'싸고 튼튼한 새로 밀어붙이는 돌격형 종족이에요.',p:'새 가격 -5% · 새 체력 +6% · 새가 탈출하면 골드 +10 · 타워 가격 +16%',
  uc:.95,uhp:1.06,tc:1.16,loot:10,ban:['swan','peacock','cctv']},
 dusk:{n:'황혼 깃털단',ic:'🌙',col:'#a78bfa',c3:0xa78bfa,tag:'부활 · 독',
  fl:'“해가 져야 우리 시간이 시작돼요. 쓰러졌다고요? 잠깐 눈 붙인 거예요.”',
  d:'쓰러져도 돌아오는 어둠의 종족이에요. 대신 몸이 약하고 타워가 비싸요.',p:'가격 400G 이상 새는 한 번 되살아나요(체력 50%) · 새 체력 -10% · 타워 가격 +10%',
  uhp:.9,tc:1.1,rv:400,ban:['rooster','swan']},
 grove:{n:'숲 지킴이',ic:'🌿',col:'#4ade80',c3:0x4ade80,tag:'사거리 · 은신',
  fl:'“조용히, 멀리, 정확하게. 숲은 다 보고 있어요.”',
  d:'멀리서 쏘고 빠르게 달리는 숲의 파수꾼이에요. 새 체력은 조금 낮아요.',p:'타워 사거리 +0.5 · 새 이동속도 +10% · 새 체력 -8%',
  tr:.5,spd:1.1,uhp:.92,ban:['turkey','dodo','acorn']}};
const RK_KEYS=Object.keys(RACE);let raceSel='nest';
T.push(
 {id:'keep',race:'nest',n:'수호 망루',c:300,d:80,r:4.2,cd:1,ic:'🏯',col:0x60a5fa,x:'긴 사거리 균형 타워',fl:'“저 위에서 보면 월세 안 낸 새가 다 보여요.”'},
 {id:'bell',race:'nest',n:'경보 종탑',c:260,d:11,r:3.2,cd:1.4,self:1,slow:1,stun:.4,ic:'🔔',col:0xfbbf24,x:'종소리로 주변 감속 + 짧은 기절',fl:'“댕! 하는 순간 모두가 멈칫해요. 일요일 아침의 그 소리예요.”'},
 {id:'ballista',race:'raptor',n:'투창 노포',c:230,d:76,r:3.4,cd:1.5,t:'G',ic:'🗡️',col:0xef4444,x:'지상 전용 강타',fl:'“창던지기 대회 금메달 출신. 지상 한정이에요.”'},
 {id:'spikes',race:'raptor',n:'가시 참호',c:170,d:21,r:2.4,cd:.55,splash:1.1,t:'G',ic:'⛏️',col:0xb45309,x:'지상 광역 연타',fl:'“밟으면 아야 소리가 절로 나는 맨발 천적.”'},
 {id:'scarecrow',race:'dusk',n:'해골 허수아비',c:280,d:15,r:3.2,cd:1.2,self:1,poison:7,amp:1,ic:'💀',col:0xa78bfa,x:'주변 독 + 받는 피해 +35%',fl:'“참새도 무서워서 못 앉는 허수아비. 새는 더더욱요.”'},
 {id:'tomb',race:'dusk',n:'묘비 둥지',c:240,d:23,r:3,cd:1.1,splash:1.3,slow:1,poison:5,t:'G',ic:'🪦',col:0x7c3aed,x:'지상 광역 감속 + 독',fl:'“여기 잠들다. 아니, 잠깐 쉬는 중이에요.”'},
 {id:'moonbow',race:'grove',n:'달빛 활',c:300,d:220,r:5,cd:1.3,t:'A',ic:'🌛',col:0xc4b5fd,x:'초장거리 대공',fl:'“보름달이 뜨면 명중률이 두 배. (기분 탓)”'},
 {id:'thorn',race:'grove',n:'가시 덩굴',c:200,d:10,r:2.8,cd:.8,splash:1.2,slow:1,ic:'🌿',col:0x22c55e,x:'광역 감속',fl:'“발에 감기면 풀리지 않아요. 풀인데도요.”'});
U.push(
 {id:'knight',race:'nest',n:'근위 황새',c:420,hp:494,sp:1.2,t:'G',dm:2,inc:21,shield:390,over:1,ic:'🛡️',col:0xf1f5f9,x:'긴 다리로 타워를 성큼 넘어 직진(지상 판정) · 보호막(독·화상·감속 면역·⚡번개에 약함, 체력 300 추가)',fl:'“방패는 들었는데 아기는 어디 갔지?”'},
 {id:'priest',race:'nest',n:'치유 사제새',c:360,hp:384,sp:1.3,t:'G',dm:1,inc:18,heal:1,ic:'⛑️',col:0xfef9c3,x:'주변 아군 치유',fl:'“아프면 부리 벌려요. 아~ 하고.”'},
 {id:'berserk',race:'raptor',n:'광전사 독수리',c:520,hp:598,sp:2.7,t:'A',dm:3,inc:33,ic:'🪓',col:0xdc2626,x:'빠른 공중 돌격',fl:'“화나면 눈이 빨개져요. 원래 빨간 거였어요.”'},
 {id:'warturkey',race:'raptor',n:'전투 칠면조',c:430,hp:855,sp:1.45,t:'G',dm:3,inc:27,ic:'🍗',col:0xb45309,x:'단단한 지상 돌격대',fl:'“추수감사절을 피해 군대에 입대했어요.”'},
 {id:'bonecrow',race:'dusk',n:'해골 까마귀',c:340,hp:252,sp:2,t:'A',dm:2,inc:22,stealth:.6,revive:1,ic:'🦴',col:0xe5e7eb,x:'진영 60%까지 은신 · 한 번 부활',fl:'“뼈만 남았는데 아직도 까악 소리는 크네요.”'},
 {id:'lich',race:'dusk',n:'망령 올빼미',c:720,hp:800,sp:1.5,t:'A',dm:4,inc:42,drain:2,revive:1,ic:'🕯️',col:0x7c3aed,x:'탈출 시 내 라이프 +2 · 한 번 부활',fl:'“밤샘 근무가 너무 길어서 영혼이 먼저 출근했어요.”'},
 {id:'shadowowl',race:'grove',n:'그림자 부엉이',c:480,hp:294,sp:2,t:'A',dm:3,inc:32,stealth:.65,ic:'🌑',col:0x1e293b,x:'진영 65%까지 은신',fl:'“없는 줄 알았죠? 계속 있었어요.”'},
 {id:'mosscrane',race:'grove',n:'이끼 두루미',c:400,hp:538,sp:1.3,t:'G',dm:2,inc:25,heal:1,imm:['poison'],ic:'🍃',col:0x4d7c0f,x:'주변 치유 · 독 면역',fl:'“이끼가 끼면 어떠한가. 건강하면 그만이지.”'});
U.sort((a,b)=>a.c-b.c);
const TECH={fire:{n:'화염',ic:'🔥',col:0xf97316,t:['ember','lava','sun'],u:'phoenix',d:'화상 지속 피해'},ice:{n:'빙결',ic:'❄️',col:0x67e8f9,t:['ice','frost','bliz'],u:'penguin',d:'감속·빙결'},
 thunder:{n:'뇌전',ic:'⚡',col:0xfacc15,t:['static','thunder','storm'],u:'thunderbird',d:'연쇄 번개·기절'},wind:{n:'폭풍',ic:'🌪️',col:0x2dd4bf,t:['breeze','wind','twister'],u:'albatross',d:'넉백·방울·대공'},
 dark:{n:'독',ic:'☠️',col:0x84cc16,t:['flu','acid','flytrap'],u:'vampire',d:'독·약화·흡혈'}},TK=Object.keys(TECH),TECH2C=300;
const BAL=/*BAL*/{shz:2,upk:1.05,upg:.2,rh:.15,rs:0.5,hcr:2,hmx:0.03,pk:0.35,pmax:5,pdur:4,bk:1.1,bdur:3,bsp:.7,cl:2.5,mode:{normal:{uh:0.95,td:0.84,as:1.02},race:{uh:1,td:0.85,as:0.97}},cap:44,ovs:.9,airInc:.8,kr:.2,ui:.9,need:1,uhp:2.4,incS:805,late1:420,lm1:2,late2:540,lm2:3,py:{ar:.85,am:2.4,gr:1.1,gm:.8,lr:1.1,la:1.2,lg:.4}}/*BALEND*/;T.forEach(b=>{if(!b.d||b.pylon||b.snack||b.cctv)return;const tr=[];if(b.cd<=.8){b.rapid=1;tr.push('⚡연사 가속: 계속 쏘면 공속 최대 +50%')}else if(b.cd>=1.5){b.heavy=1;tr.push('💥강타: 3번째 공격마다 치명타 ×2 + 대상 최대체력 3% 추가 피해')}if(b.poison)tr.push('☠️독 중첩(최대 5)'+((b.splash||b.self)?' · 독연기 2.5초 잔류':''));if(b.burn)tr.push('🔥화상 번짐: 불탄 채 쓰러지면 옆으로 옮겨붙음');if(tr.length)b.x=(b.x?b.x+' · ':'')+tr.join(' · ')});U.forEach(u=>{u.inc=Math.round(u.inc*1.4*(u.t==='A'?BAL.airInc:1));u.hp=Math.round(u.hp*BAL.uhp);if(u.shield)u.shield*=BAL.uhp});const TICK=4;
const COMBO=T.filter(t=>t.combo).map(t=>({k:t.combo,t:t.id,u:U.find(u=>u.combo&&u.combo.join()===t.combo.join()).id,n:t.combo.map(k=>TECH[k].n).join('+'),ic:t.combo.map(k=>TECH[k].ic).join('')}));
// 🎭 웃긴 이름 + 한 줄 설명 (도감용)
const NM={
egg_legs:['수상한 알','다리가 왜 달렸는지는 묻지 마세요. 많이 보내면 무언가 일어난대요…'],
kiwi:['과일아닌 키위','과일 코너에서 발견되면 즉시 신고 바랍니다.'],
chick:['삐약이','귀여움으로 타워를 0.1초 망설이게 만들어요. (기분 탓)'],
turkey:['탈주 칠면조','추수감사절이 다가오자 전력 질주 중. 겁 많고 약하지만 몸값(인컴)은 비싸요.'],
rooster:['새벽5시 수탉','알람 끄기 버튼이 없어요.'],
pigeon:['닭둘기','과자 부스러기만 보면 이성을 잃어요.'],
goose:['깡패 거위','공원 최강자. 쓰러져도 알 두 개가 복수하러 와요.'],
parrot:['욕쟁이 앵무새','욕쟁이 할머니 국밥집에서 자라서 말버릇이 험해요. 날아가면서 꼭 세 마디씩 쏘아붙여요.'],
crow:['닌자 까마귀','반짝이는 건 다 훔치고, 절대 들키지 않아요.'],
pirate:['북극해적갈매기','북극해를 주름잡는 해적 선장. 칼 한 자루 휘두르며 지나가는 김에 남의 인컴까지 털어 가요.'],
duck:['피서 중인 튜브 오리','여름휴가 중이라 튜브 끼고 둥둥 떠내려와요. 아무리 맞아도 "꽥?" 하고 말아요.','튜브 오리'],
woodpecker:['헤드뱅 딱따구리','하루 12,000번 박치기. 두통은 타워가 느껴요.'],
seagull:['똥폭격 갈매기','꼭 세차한 날만 골라서 와요.'],
swan:['물밑 영혼 발장구 백조','우아하게 떠 있는 건 수면 위뿐! 물 아래선 영혼까지 갈아 넣어 발장구 치느라 식은땀이 줄줄. 그 정성으로 보호막을 둘러요.','발장구 백조'],
penguin:['덜덜이 펭귄 삼형제','셋이 꼭 붙어 다녀야 체온이 유지돼요. 하루 종일 덜덜 떨어서 원래 느린데, 감속 디버프쯤은 그냥 무시합니다!','펭귄 삼형제'],
vampire:['드라큘라 박쥐','마늘 타워는 아직 개발 중이에요.'],
peacock:['관종 뿜뿜 공작','"나 좀 봐!" 하고 꼬리 부채를 촤악 펼치면, 그 눈부신 자태에 감탄한 아군 새들의 체력이 사르르 회복돼요.','관종 공작'],
dodo:['각설이 도도새','얼씨구씨구 들어간다~ 작년에 멸종했던 도도새가 죽지도 않고 또 왔네! 둔하지만 맷집 하나는 끝내줘요.'],
falcon:['과속 송골매','시속 389km. 과속 카메라에 매일 찍혀요.'],
albatross:['시급 알바트로스','날개는 길고 시급은 짧아요. 바람 정도로는 퇴근 안 해요.'],
owl:['야근 올빼미','밤샘이 체질이라 날 힘도 없어서 걸어서 출근해요. 커피 한 모금이면 보호막 충전 완료.'],
thunderbird:['정전 천둥새','지나가면 타워 전원이 나가요. 관리비 폭탄 주의.'],
eagle:['대머리 독수리','대머리가 아니라 흰머리래요. 본인 주장이에요.'],
phoenix:['부활절 불사조','한 번 죽는 건 그냥 준비운동이에요.'],
humbee:['윙윙 벌새 떼','벌인지 새인지 본인들도 몰라요. 너무 작고 빨라서 느린 대포로는 맞히기 어려워요. 꿀은 안 줘요.','벌새 떼'],
pelican:['만원 버스 펠리컨','부리 주머니에 승객을 꽉꽉 태운 하늘 버스. 격추되면 승객들이 "여기서 내릴게요!" 하고 우르르 쏟아져요.','만원 펠리컨'],
demcrane:['철거반장 두루미','구청에서 나왔습니다. 허가 안 받은 타워는 부리로 번쩍 들어서 치워 버려요. 안전모는 필수!','철거 두루미'],
archaeo:['1억 5천만 년 만의 외출 시조새','박물관 화석에서 깨어난 할아버지 새. 요즘 타워가 신기해서 자꾸 쳐다보다가, 많이 맞으면 돌 껍질이 깨지고 진짜 모습으로 깨어나요.','시조새'],
archaeo_g:['갓 깨어난 시조새','화석 껍질을 모자처럼 쓰고 깨어났어요. 깃털엔 아직 돌 무늬가 남았지만 다리는 쌩쌩, 공룡 시절처럼 쿵쿵 달려요.','갓 깨어난 시조새'],
crocbird:['악어 치과의사 악어새','악어 이빨 청소를 해 주는 대가로 공짜로 타고 다녀요. 진료 중에 건드리면 악어가 엄청 화내요!','악어새'],
ostrich:['발레리나 지망생 타조','백조의 호수 주인공을 꿈꾸며 발끝으로 사뿐사뿐… 걸을 때마다 지진이 나요.','발레 타조'],
crane:['온천욕 두루미','뜨끈한 물에 몸 담그고 와서 불도 얼음도 안 통해요.'],
plasmabird:['고속충전 불새','완충 5분, 비행 10분. 타워도 같이 방전시켜요.'],
comet:['퀵배달 혜성매','"고객님, 문 앞에 두고 갑니다." (라이프 피해를)'],
plague:['재채기 까마귀','에취! 마스크 안 쓴 타워는 앞이 안 보여요.'],
auroraowl:['오로라 덕후','오로라 보러 북극까지 다녀온 올빼미. 이제 무서운 게 없어요.'],
blizgull:['눈사람 갈매기','당근 코 두 개, 갈매기 둘. 바람이 불어도 꿈쩍 안 해요.'],
frostpeng:['냉동 펭귄단','냉동실을 탈출한 4인조. 독도 감속도 이미 얼어서 안 먹혀요.'],
stormeagle:['태풍 독수리','일기예보에 이름이 나오는 독수리예요.'],
voltbat:['보조배터리 박쥐','"충전 좀 할게요" 하면서 당신의 라이프를 빼앗아요.'],
ghostcrow:['투명망토 까마귀','마법학교 중퇴. 투명망토만 챙겨 나왔어요.'],
wall:['월세 둥지','벽(wall)이라서 월세예요. 보증금 20G.'],
egg:['알까기 새총','알까기 세계 챔피언이 직접 튜닝했어요.'],
air:['깃털 미사일','간지러움과 아픔을 동시에 주는 공중 요격기.'],
snack:['과자 뿌리개','갈매기가 환장하는 바삭한 그 과자를 뿌려요. (특정 상품 아님 주의)'],
pylon:['참새 전봇대','참새는 전깃줄에 앉아도 괜찮다고요? 이건 고압이에요. 이어 붙일수록 찌릿찌릿!'],
cctv:['부엉이 CCTV','"다 보고 있다…" 24시간 녹화 중. 은신한 새도 4K 화질로 잡아내요.'],
net:['잠자리채 그물포','여름방학 곤충채집 1등의 실력으로 하늘의 새를 낚아요.'],
acorn:['다람쥐 대포','다람쥐가 겨울 식량을 장전 중. 맞으면 진짜 아파요.'],
ember:['바베큐 둥지','근처만 와도 치킨 냄새가 나요. 새들에겐 공포 그 자체.'],
lava:['찜질방 분화구','양머리 수건 필수. 땀 대신 체력이 빠져요.'],
sun:['자외선 등대','SPF 0. 선크림 안 바른 새는 한 방이에요.'],
ice:['냉동 달걀','먹다 남은 달걀을 얼렸더니 무기가 됐어요.'],
frost:['얼음땡 결정','"얼음!" 하면 진짜 얼어요. 땡은 없어요.'],
bliz:['에어컨 18도 탑','사무실 에어컨 전쟁의 최종 병기.'],
static:['겨울 니트 깃털','문고리 잡을 때의 그 찌릿함을 3마리에게 나눠줘요.'],
thunder:['찌릿찌릿 피뢰침','맞으면 1초간 멍해져요. 머리도 뽀글뽀글.'],
storm:['월요병 먹구름','월요일 아침의 기운을 5마리에게 연쇄 전파해요.'],
breeze:['미풍 선풍기','미풍인데 왜 밀려나는지 아무도 몰라요.'],
wind:['비눗방울 막대','목욕 싫어하는 새들의 천적. 후~ 불면 방울에 갇혀 둥실둥실, 터질 땐 따끔!'],
twister:['회오리 감자','휴게소 회오리 감자의 원조. 하늘을 나는 새 전문.'],
bat:['박쥐 고시원','월 180G, 창문 없음. 드라큘라 박쥐가 여기서 공부해요.'],
flu:['조류독감 AI','AI는 Avian Influenza(조류 인플루엔자)의 줄임말이에요. 인공지능 아님 주의!'],
acid:['식초 늪','새콤한 늪에 빠지면 몸이 흐물흐물. 받는 피해가 35% 늘어요.'],
steam:['불한증막 사우나','뜨거웠다 차가웠다, 새들 정신이 혼미해져요.'],
plasma:['전자레인지 포','"땡!" 소리와 함께 4마리가 동시에 데워져요.'],
firestorm:['불맛 회오리','웍질 장인이 만든 불맛 토네이도.'],
pyre:['마라탕 화로','맵기 4단계에 독까지. 혀도 체력도 마비돼요.'],
aurora:['냉동 전기장판','따뜻한 척하다가 얼려버리는 배신의 장판.'],
whiteout:['빙수 블렌더','새들을 갈아서 빙수로… 만들진 않고 밀어내요.'],
frostbane:['유통기한 아이스크림','유통기한 2019년. 얼어 있어도 배탈 나요.'],
tempest:['태풍경보 탑','재난문자 발송 기능 탑재. 새들이 우산을 챙겨요.'],
venomvolt:['문어발 콘센트','멀티탭에 멀티탭 꽂기. 소방관이 제일 싫어하는 타워.'],
miasma:['방귀 선풍기','누가 뀌었는지 모르게 골고루 퍼뜨려요.']};
const CFL={steam:'불과 얼음이 만나면? 사우나 온탕·냉탕 무한 왕복.',plasma:'불에 전기를 더하면 전자레인지가 돼요. 과학입니다.',firestorm:'캠핑 불멍에 부채질하다가 대형 사고로.',pyre:'불에 독을 넣으면 마라탕. 맵고 아프고 중독돼요.',
 aurora:'얼음과 번개가 만나면 하늘에 오로라가 떠요.',whiteout:'얼음 + 바람 = 겨울 출근길 체감온도 영하 20도.',frostbane:'독을 얼려 두면 오래 보관돼요. 냉동실 정리 필수.',tempest:'번개와 바람이 손잡으면 태풍 특보가 떠요.',
 venomvolt:'독과 전기, 문어발 콘센트만큼 위험한 조합.',miasma:'바람에 독을 실으면… 지하철 옆자리의 그 냄새.'};
Object.assign(NM,{hatch_chick:['갓깬 삐약이','"여기가 어디예요?" 태어나자마자 전쟁터.'],hatch_fire:['맥반석 병아리','찜질방에서 부화해서 뜨거운 건 하나도 안 무서워요.'],
 hatch_ice:['아이스 병아리','냉장고 출신. 감속? 원래 차가운 성격이에요.'],hatch_thunder:['찌릿 병아리','솜털이 정전기로 빳빳하게 서 있어요.'],hatch_wind:['풍선 병아리','부화하자마자 바람이 들어가서 둥실둥실.'],
 hatch_dark:['방귀 병아리','냄새가 너무 심해서 타워가 눈을 못 떠요.'],hatch_gold:['황금 병아리','"이 알, 감정가 얼마예요?" 지나가면 돈이 따라와요.'],hatch_dino:['티라노 병아리','삐약… 아니 크아앙! 조상님 유전자가 깨어났어요.'],
 eggchief:['알부자 회장닭','알을 낳을수록 재산이 불어나는 회장님. 걸으며 3초마다 수상한 알을 "투자"해요.','알부자 회장닭']});
// 🥚 이번 판에서 보낸 수상한 알 수(판마다 0부터)와 마일스톤
const EGG={n:0};
const EGGM=[{n:10,k:'hatch',ic:'🐣',t:'부화 해금',d:'보낸 알이 진영 중간에서 부화해요. 내 속성에 따라 다른 병아리가 나와요!',u:'hatch_chick'},
 {n:30,k:'twin',ic:'🪺',t:'쌍둥이 알',d:'알을 보낼 때 25% 확률로 쌍둥이가 같이 가요.'},
 {n:50,k:'gold',ic:'✨',t:'황금알',d:'10% 확률로 황금알! 부화하면 황금 병아리가 되어 탈출 시 인컴을 털어와요.',u:'hatch_gold'},
 {n:100,k:'chief',ic:'🎩',t:'전설의 새: 알부자 회장닭',d:'상점에 알부자 회장닭이 나타나요. 걸으며 수상한 알을 낳아요.',u:'eggchief'},
 {n:150,k:'dino',ic:'🦖',t:'고대 유전자',d:'부화할 때 3% 확률로 티라노 병아리가 태어나요.',u:'hatch_dino'}];
const eggHas=k=>{const m=EGGM.find(m=>m.k===k);return !!m&&EGG.n>=m.n},eggN=p=>!p?0:p.id===0?EGG.n:(S&&S.net==='host'&&!p.ai?(p.egg||0):0)/* 온라인 손님은 방장 기기에서 자기 알 개수로 연구 효과(AI는 없음) */,eggHasP=(p,k)=>{const m=EGGM.find(m=>m.k===k);return !!m&&eggN(p)>=m.n},eggNext=()=>EGGM.find(m=>EGG.n<m.n);
Object.assign(NM,{priest:['아~ 해봐요 사제새','아프면 부리 벌려요. 아~ 하고.'],knight:['육아휴직 황새','방패는 들었는데 아기는 어디 갔지? 다리가 길어서 타워쯤은 성큼 넘어가요.'],
 warturkey:['추수감사절 탈영… 아니 입대 칠면조','추수감사절을 피해 군대에 입대했어요.'],berserk:['버럭 독수리','화나면 눈이 빨개져요. 원래 빨간 거였어요.'],
 bonecrow:['뼈다귀 까악이','뼈만 남았는데 아직도 까악 소리는 크네요.'],lich:['영혼출근 올빼미','밤샘 근무가 너무 길어서 영혼이 먼저 출근했어요.'],
 mosscrane:['이끼 건강왕 두루미','이끼가 끼면 어떠한가. 건강하면 그만이지.'],shadowowl:['계속 있었던 부엉이','없는 줄 알았죠? 계속 있었어요.']});
[...T,...U].forEach(x=>{const v=NM[x.id];if(v){x.n=v[0];x.fl=v[1];if(v[2])x.sn=v[2]}});

// 🔌 스튜디오 모듈 연결 지점: 사운드팀은 sfx.js에서 SFX를, 아트팀은 art.js에서 ART를 구현해요. 없으면 조용히 넘어가요.
const sfx=(n,a)=>{try{if(S&&S.sim)return;if(typeof SFX!=='undefined'&&SFX.play)SFX.play(n,a||{})}catch(e){}};
const artFx=(n,a)=>{try{if(S&&S.sim)return;if(typeof ART!=='undefined'&&ART[n]){const r=ART[n](a||{});if(n==='bird'&&a&&a.b&&a.b.stone)stoneify(a.m,a.b.stone===2);if(n==='bird'&&a&&a.b&&a.b.mat)matFx(a.m,a.b.mat,a.b);return r}}catch(e){}};
// 🧬 타워 진화 이름: 강화 Lv.1~4마다 이름이 바뀌어요(작가팀). 없으면 Ⅱ·Ⅲ·Ⅳ
const EVO=/*EVO*/{"wall":["월세 둥지","월세 둥지","월세 둥지","월세 둥지"],"egg":["알까기 새총","새권총","새개틀링건","알마게돈 새대포"],"air":["깃털 미사일","간질간질 유도탄","깃털 다연장포","대륙간 간지럼탄"],"acorn":["다람쥐 대포","볼빵빵 곡사포","다람쥐 자주포","도토리묵 요새포"],"snack":["과자 뿌리개","과자 분사기","과자 스프링클러","무한리필 과자탑"],"pylon":["참새 전봇대","참새 변압기","참새 송전탑","만볼트 참새철탑"],"cctv":["부엉이 CCTV","4K 부엉이캠","야간투시 부엉이","부엉이 첩보위성"],"net":["잠자리채 그물포","왕잠자리채","꽁치잡이 투망포","곤충채집 끝판왕"],"ember":["바베큐 둥지","숯불구이 둥지","통닭 회전 둥지","전설의 치킨집"],"lava":["찜질방 분화구","불가마 분화구","황토 불가마 화산","용암 찜질 궁전"],"sun":["자외선 등대","땡볕 등대","돋보기 등대","폭염 태양신전"],"ice":["냉동 달걀","꽁꽁 언 달걀","냉동실 계란판","만년설 황금알"],"frost":["얼음땡 결정","얼음땡 고드름","얼음땡 술래탑","땡 없는 빙하"],"bliz":["에어컨 18도 탑","에어컨 16도 탑","냉장고 4도 탑","남극 영하40도 탑"],"static":["겨울 니트 깃털","털스웨터 깃털","수면바지 깃털","문고리 대마왕"],"thunder":["찌릿찌릿 피뢰침","뽀글뽀글 피뢰침","번개 파마 탑","전설의 벼락파마"],"storm":["월요병 먹구름","출근길 먹구름","야근 먹구름","월요일 무한반복"],"breeze":["미풍 선풍기","미풍 회전 선풍기","미풍이라던 선풍기","미풍 탈 쓴 태풍"],"wind":["비눗방울 막대","비눗방울 기계","비눗방울 대포","거품 목욕탕 대왕"],"twister":["회오리 감자","치즈 회오리 감자","왕꼬치 회오리","휴게소의 전설"],"bat":["박쥐 고시원","박쥐 원룸","박쥐 오피스텔","박쥐 펜트하우스"],"flu":["조류독감 AI","조류독감 AI2.0","조류독감 AI 프로","조류독감 초지능"],"acid":["식초 늪","사과식초 늪","피클 절임 늪","전설의 초절임 늪"],"steam":["불한증막 사우나","냉온탕 사우나","때밀이 사우나","목욕탕 대왕궁"],"plasma":["전자레인지 포","해동모드 레인지포","땡땡땡 레인지포","우주 전자레인지"],"firestorm":["불맛 회오리","웍질 회오리","불쇼 대회오리","중화요리 신의 웍"],"pyre":["마라탕 화로","맵기 5단계 화로","맵기 10단계 화로","맵기 측정불가"],"aurora":["냉동 전기장판","배신의 전기장판","북극 전기장판","오로라 대장판"],"whiteout":["빙수 블렌더","팥빙수 블렌더","눈꽃빙수 믹서","전설의 빙수장인"],"frostbane":["유통기한 아이스크림","세기말 아이스크림","빙하기산 아이스크림","공룡시대 아이스크림"],"tempest":["태풍경보 탑","재난문자 송신탑","슈퍼태풍 경보탑","태풍의 눈 관제탑"],"venomvolt":["문어발 콘센트","대왕문어발 콘센트","멀티탭의 멀티탭","전설의 문어발왕"],"miasma":["방귀 선풍기","고구마 방귀 선풍기","청국장 방귀 선풍기","범인 없는 방귀폭풍"]}/*EVOEND*/;
const CBM=/*CBM*/{}/*CBMEND*/;T.forEach(t=>{if(CBM[t.id])t.d=Math.round(t.d*CBM[t.id])});
Object.assign(EVO,{keep:["수호 망루","경비실 초소","아파트 경비 요새","입주민 대표 철옹성"],bell:["경보 종탑","새벽 종탑","재난 경보 종탑","새해맞이 보신각"],
 ballista:["투창 노포","쌍발 노포","연발 노포","창던지기 금메달 노포"],spikes:["가시 참호","못판 참호","지압 발판 참호","고행자의 이불"],
 scarecrow:["해골 허수아비","해골 파수꾼","해골 마법사 허수아비","저승 허수아비 대왕"],tomb:["묘비 둥지","이끼 낀 묘비","납골당 둥지","저승 분양 아파트"],
 moonbow:["달빛 활","보름달 활","은하수 장궁","토끼 방아 활"],thorn:["가시 덩굴","장미 덩굴","정글 덩굴","아마존 덩굴 지옥"]});
/* ⚡ 뇌전 타워(조합 포함)는 보호막에 2배 */T.forEach(t=>{if(t.tech==='thunder'||(t.combo&&t.combo.includes('thunder')))t.zap=1});
T.forEach(t=>{t.lvn=(EVO[t.id]&&EVO[t.id].length===4)?EVO[t.id]:[t.n,t.n+' Ⅱ',t.n+' Ⅲ',t.n+' Ⅳ'];t.lvn[0]=t.n});const tName=t=>t.bp.lvn[t.lv-1]||t.bp.n;
const TB=Object.fromEntries(T.map(t=>[t.id,t])),UB=Object.fromEntries(U.map(u=>[u.id,u]));
const PC=['#ef4444','#3b82f6','#10b981','#eab308','#a855f7','#f97316','#06b6d4','#ec4899'];
/* 2026-11-11 난이도 한 단계씩 내림(옛 쉬움 삭제): 키는 그대로 두고 이름만 → N=쉬움(옛 일반)·M=일반(옛 숙련)·H=숙련(옛 어려움)·X=어려움(옛 헬)·Z=새 헬 */
const DIFF=/*DIFF*/{N:{n:'🐣 쉬움',learn:0,g:500,i:30,tick:1.6,d:'AI가 차분하게 판단해요. 처음 해 보는 분께 추천!'},M:{n:'🐥 일반',learn:0.3,g:575,i:37,tick:1.25,d:'AI가 한 박자 빠르고 자금도 넉넉해요. 🎓 알파고에게 운영을 30% 배웠어요. 🐍 넓은 가로 미로로 길을 1.9배 늘려요.'},H:{n:'🐓 숙련',learn:0.6,g:650,i:45,tick:.9,d:'AI가 더 많은 자금으로 빠르게 판단하고(🎓 알파고 노하우 60%), 🐍 세로·대각선·빗살 미로 중 하나로 길을 2.2~2.6배 늘려요.'},X:{n:'🦅 어려움',learn:1,g:800,i:58,tick:.7,im:1.12,uh:1.06,d:'🎓 알파고 노하우를 다 배운 AI가 번개처럼 판단하고 돈을 12% 더 벌고 새 체력도 6% 높아요. 정찰·킬존·재배치 미로를 쓰는 지능형 AI도 섞여요. 🐍 길을 최대 3배 늘려요.'},Z:{n:'🔥 헬',learn:1,g:950,i:70,tick:.5,im:1.25,uh:1.15,d:'진짜 극악! 🎓 알파고 노하우를 다 배운 AI, 돈 +25%, 새 체력 +15%, 판단은 0.5초마다. 지능형 AI가 더 많이 나오고, 미로는 최대 3배. 살아남으면 자랑해도 돼요.'},A:{n:'🤖 알파고',g:800,i:58,tick:.4,im:1.12,uh:1.06,d:'AI끼리 2,160판을 붙여 스스로 진화한 "알파고 AI" 7명! 돈·체력 보너스는 어려움과 같지만, 0.4초마다 계산하고 빙결·폭풍 촘촘 미로로 막아요. 이기면 진짜 전설.'}}/*DIFFEND*/;
/*AIS_BEGIN*/const AIS=[
{n:"수익 스노우볼",s:{"n":8,"win":25,"pts":64,"inc5":1585,"lost":86,"surv":25},g:{"tw0":3.181,"twRate":1.679,"inc0":54.144,"incRate":29.531,"uShare":0.305,"uAir":0.163,"uHeavy":0.634,"uTier":0.572,"uSpec":0.491,"wall":0.496,"upAgg":0.062,"upMax":3.822,"def8":0.327,"crisis":57.023,"rush":283.005,"keep":547.247,"tech2":0.5,"m_cx":0.8,"tech":4.5,"m_egg":0.64,"m_air":0.385,"m_acorn":0.885,"m_t1":0.54,"m_t2":0,"m_t3":0.648}},
{n:"철벽 수비",s:{"n":29,"win":55,"pts":82,"inc5":239,"lost":51,"surv":66},g:{"tw0":3.719,"twRate":1.932,"inc0":98.972,"incRate":49.86,"uShare":0.732,"uAir":0.168,"uHeavy":0.904,"uTier":0.968,"uSpec":0.752,"wall":0.228,"upAgg":0.941,"upMax":3.683,"def8":1.285,"crisis":22.466,"rush":791.507,"keep":404.873,"tech2":1.5,"m_cx":0.8,"tech":3.5,"m_egg":0.497,"m_air":0.042,"m_acorn":0.935,"m_t1":0.454,"m_t2":0.982,"m_t3":0.021}},
{n:"폭풍 전략가",s:{"n":9,"win":44,"pts":62,"inc5":206,"lost":76,"surv":44},g:{"tw0":6.807,"twRate":1.747,"inc0":30,"incRate":44.365,"uShare":0.743,"uAir":0.133,"uHeavy":0.826,"uTier":0.91,"uSpec":0.629,"wall":0.223,"upAgg":0.519,"upMax":3.834,"def8":1.239,"crisis":25.747,"rush":797.024,"keep":164.72,"tech2":2.5,"m_cx":0.8,"tech":3.5,"m_egg":0.488,"m_air":0.042,"m_acorn":0.941,"m_t1":0.851,"m_t2":0.73,"m_t3":0.468}},
{n:"특수 조류 조련사",s:{"n":21,"win":24,"pts":62,"inc5":442,"lost":85,"surv":24},g:{"tw0":13.176,"twRate":1.883,"inc0":86.88,"incRate":2.308,"uShare":0.896,"uAir":0.58,"uHeavy":0.329,"uTier":0.932,"uSpec":0.973,"wall":0.324,"upAgg":0.729,"upMax":2.611,"def8":0.568,"crisis":60.23,"rush":318.559,"keep":157.317,"tech2":1.5,"m_cx":0.8,"tech":0.5,"m_egg":0.503,"m_air":0.911,"m_acorn":0.683,"m_t1":0.773,"m_t2":0.689,"m_t3":0.508}},
{n:"빙결 요새",s:{},g:{"tw0":10.997,"twRate":3.795,"inc0":92.626,"incRate":39.009,"uShare":0.836,"uAir":0.335,"uHeavy":0.607,"uTier":1,"uSpec":0.285,"wall":0.11,"upAgg":0.868,"upMax":3.295,"def8":0.729,"crisis":49.713,"rush":881.987,"keep":560.587,"tech2":4.5,"m_cx":0.8,"tech":1.5,"m_egg":1,"m_air":0.46,"m_acorn":0.35,"m_t1":0.547,"m_t2":0.383,"m_t3":0.218}},
{n:"중장갑 러시",s:{"n":10,"win":20,"pts":61,"inc5":185,"lost":68,"surv":40},g:{"tw0":3,"twRate":2.588,"inc0":30,"incRate":46.64,"uShare":0.726,"uAir":0.163,"uHeavy":0.959,"uTier":0.954,"uSpec":0.307,"wall":0.203,"upAgg":0.908,"upMax":3.684,"def8":1.299,"crisis":26.121,"rush":316.723,"keep":393.189,"tech2":4.5,"m_cx":0.8,"tech":2.5,"m_egg":0.551,"m_air":0.075,"m_acorn":0.709,"m_t1":0.461,"m_t2":0.773,"m_t3":0.053}},
{n:"미로 설계자",s:{"n":23,"win":30,"pts":58,"inc5":1306,"lost":74,"surv":30},g:{"tw0":3.613,"twRate":0.292,"inc0":110.666,"incRate":23.741,"uShare":0.412,"uAir":0.48,"uHeavy":0.36,"uTier":0.514,"uSpec":0.118,"wall":0.459,"upAgg":0.988,"upMax":2.766,"def8":0.461,"crisis":21.207,"rush":571.912,"keep":621.537,"tech2":3.5,"m_cx":0.8,"tech":0.5,"m_egg":0.933,"m_air":0.398,"m_acorn":0.605,"m_t1":0.574,"m_t2":0.356,"m_t3":0.625}}];/*AIS_END*/
// 🧠 AI 성향 풀: 속성 조합 10 × 운영 스타일 3(이자형=인컴 투자·안정형=수비·밸런스형) + 특수 전략. 한 판에 7개를 무작위로 뽑아요
/* 진화로 찾은 상위 8개 유전자(검증: 기존 AI 7명 상대 우승 75~100%, 기대 12.5%) *//* 2026-11-11 2차 학습: 새로 진화한 3개(옛 알파고 7명 상대 우승 최대 25%, 기대 12.5%) + 1차 상위 5개 */const ALPHA=[{"tw0":3.946,"twRate":2.559,"inc0":49.976,"incRate":44.928,"uShare":0.583,"uAir":0.329,"uHeavy":0.148,"uTier":0.793,"uSpec":0.502,"wall":0.378,"upAgg":0,"upMax":2.765,"def8":1.294,"crisis":28.377,"rush":150,"keep":100,"tech":1.5,"tech2":3.5,"m_cx":0.989,"m_egg":0.908,"m_air":0.301,"m_acorn":0.889,"m_t1":0.655,"m_t2":0.83,"m_t3":0.599,"fl":{},"fav":{"duck":0.11,"humbee":0.33,"phoenix":0.25,"crane":0.74,"egg_legs":0.03}},{"tw0":3.128,"twRate":2.59,"inc0":50.985,"incRate":43.856,"uShare":0.567,"uAir":0.157,"uHeavy":0.234,"uTier":0.789,"uSpec":0.445,"wall":0.413,"upAgg":0,"upMax":2.835,"def8":1.212,"crisis":25.832,"rush":270.364,"keep":124.719,"tech":1.5,"tech2":3.5,"m_cx":0.813,"m_egg":0.843,"m_air":0.315,"m_acorn":1,"m_t1":0.579,"m_t2":0.765,"m_t3":0.502,"fl":{"jug":1},"fav":{"duck":0.59,"kiwi":0.12,"humbee":0.81,"phoenix":0.25,"crane":0.17,"egg_legs":0.03,"peacock":0.37}},{"tw0":3.179,"twRate":2.812,"inc0":62.283,"incRate":48.399,"uShare":0.55,"uAir":0.244,"uHeavy":0.264,"uTier":0.812,"uSpec":0.493,"wall":0.418,"upAgg":0.065,"upMax":2.833,"def8":1.243,"crisis":23.367,"rush":197.041,"keep":100,"tech":1.5,"tech2":3.5,"m_cx":0.91,"m_egg":0.858,"m_air":0.347,"m_acorn":1,"m_t1":0.548,"m_t2":0.79,"m_t3":0.654,"fl":{},"fav":{"duck":0.11,"kiwi":0.12,"humbee":0.33,"phoenix":0.25,"crane":0.74,"egg_legs":0.03,"eagle":0.25}},{"tw0":3,"twRate":2.502,"inc0":51.012,"incRate":43.46,"uShare":0.567,"uAir":0.205,"uHeavy":0.289,"uTier":0.849,"uSpec":0.357,"wall":0.383,"upAgg":0.025,"upMax":2.714,"def8":1.3,"crisis":25.594,"rush":195.281,"keep":104.203,"tech":1.5,"tech2":3.5,"m_cx":0.98,"m_egg":0.916,"m_air":0.281,"m_acorn":1,"m_t1":0.605,"m_t2":0.939,"m_t3":0.613,"fl":{"jug":1},"fav":{"duck":0.11,"humbee":0.33,"phoenix":0.25,"archaeo":0.41,"crane":0.17,"egg_legs":0.03,"peacock":0.37}},{"tw0":3.901,"twRate":2.806,"inc0":47.107,"incRate":46.105,"uShare":0.584,"uAir":0.292,"uHeavy":0.214,"uTier":0.897,"uSpec":0.277,"wall":0.402,"upAgg":0.046,"upMax":3.129,"def8":1.3,"crisis":28.687,"rush":150,"keep":128.213,"tech":1.5,"tech2":3.5,"m_cx":0.951,"m_egg":0.882,"m_air":0.336,"m_acorn":0.995,"m_t1":0.731,"m_t2":0.903,"m_t3":0.556,"fl":{"kz":1},"fav":{"duck":0.11,"humbee":0.33,"phoenix":0.25,"crane":0.17,"egg_legs":0.03}},{"tw0":3.696,"twRate":2.762,"inc0":43.785,"incRate":45.898,"uShare":0.551,"uAir":0.264,"uHeavy":0.249,"uTier":0.825,"uSpec":0.322,"wall":0.392,"upAgg":0,"upMax":3.0,"def8":1.3,"crisis":28.139,"rush":150,"keep":140.142,"tech":1.5,"tech2":3.5,"m_cx":0.964,"m_egg":0.872,"m_air":0.306,"m_acorn":0.946,"m_t1":0.695,"m_t2":0.887,"m_t3":0.593,"fl":{"kz":1},"fav":{"duck":0.11,"humbee":0.33,"phoenix":0.25,"crane":0.17,"egg_legs":0.03}},{"tw0":3.353,"twRate":2.558,"inc0":47.981,"incRate":45.381,"uShare":0.545,"uAir":0.23,"uHeavy":0.212,"uTier":0.826,"uSpec":0.375,"wall":0.355,"upAgg":0.055,"upMax":2.806,"def8":1.264,"crisis":27.838,"rush":162.525,"keep":100,"tech":1.5,"tech2":3.5,"m_cx":1.0,"m_egg":0.943,"m_air":0.225,"m_acorn":0.927,"m_t1":0.566,"m_t2":0.904,"m_t3":0.586,"fl":{"jug":1},"fav":{"duck":0.11,"humbee":0.33,"phoenix":0.25,"archaeo":0.04,"crane":0.17,"egg_legs":0.03,"peacock":0.37}},{"tw0":6.532,"twRate":2.694,"inc0":56.553,"incRate":45.569,"uShare":0.399,"uAir":0.218,"uHeavy":0.273,"uTier":0.862,"uSpec":0.424,"wall":0.417,"upAgg":0,"upMax":2.886,"def8":1.297,"crisis":20.18,"rush":291.992,"keep":123.593,"tech":1.5,"tech2":3.5,"m_cx":0.952,"m_egg":0.802,"m_air":0.189,"m_acorn":0.857,"m_t1":0.675,"m_t2":0.89,"m_t3":0.434,"fl":{"kz":1,"scout":1},"fav":{"duck":0.11,"humbee":0.33,"phoenix":0.84,"crane":0.32,"peacock":0.1,"pelican":0.16}}];
/* 🎓 알파고 노하우(운영 유전자 평균): 일반 AI에게 난이도만큼(DIFF.learn) 섞어 가르침 *//* 🎓 성향별 알파고(ARCH 진화, 성향 핵심 유전자 고정): 이자형·안정형·러시형 */const ALPHA_ARCH={"inc":{"tw0":5.103,"twRate":3.493,"inc0":120.888,"incRate":46.092,"uShare":0.796,"uAir":0.305,"uHeavy":0,"uTier":0.715,"uSpec":0.312,"wall":0.27,"upAgg":0,"upMax":2.54,"def8":1.3,"crisis":37.867,"rush":150,"keep":152.548,"tech":1.5,"tech2":0.147,"m_cx":0.74,"m_egg":0.825,"m_air":0.425,"m_acorn":0.902,"m_t1":0.874,"m_t2":0.898,"m_t3":0.524,"fl":{"kz":1,"jug":1},"fav":{"duck":0.11,"humbee":0.08,"phoenix":0.25,"archaeo":0.04,"crane":0.68,"egg_legs":0.03,"ghostcrow":0.17,"pelican":0.45}},"def":{"tw0":6.083,"twRate":2.762,"inc0":43.785,"incRate":45.898,"uShare":0.551,"uAir":0.264,"uHeavy":0.249,"uTier":0.825,"uSpec":0.322,"wall":0.392,"upAgg":0,"upMax":3,"def8":1.3,"crisis":28.139,"rush":150,"keep":140.142,"tech":1.5,"tech2":3.5,"m_cx":0.964,"m_egg":0.872,"m_air":0.306,"m_acorn":0.946,"m_t1":0.695,"m_t2":0.887,"m_t3":0.593,"fav":{"duck":0.11,"humbee":0.33,"phoenix":0.25,"crane":0.17,"egg_legs":0.03},"fl":{"kz":1}},"rush":{"tw0":3.901,"twRate":2.806,"inc0":47.107,"incRate":46.105,"uShare":0.824,"uAir":0.292,"uHeavy":0.214,"uTier":0.897,"uSpec":0.277,"wall":0.402,"upAgg":0.046,"upMax":3.129,"def8":1.3,"crisis":28.687,"rush":150,"keep":128.213,"tech":1.5,"tech2":3.5,"m_cx":0.951,"m_egg":0.882,"m_air":0.336,"m_acorn":0.995,"m_t1":0.731,"m_t2":0.903,"m_t3":0.556,"fav":{"duck":0.11,"humbee":0.33,"phoenix":0.25,"crane":0.17,"egg_legs":0.03},"fl":{"kz":1}},"air":{"tw0":4.178,"twRate":2.645,"inc0":58.38,"incRate":38.67,"uShare":0.331,"uAir":0.854,"uHeavy":0.287,"uTier":0.746,"uSpec":0.467,"wall":0.439,"upAgg":0.034,"upMax":2.67,"def8":1.3,"crisis":23.893,"rush":150,"keep":100,"tech":1.5,"tech2":3.5,"m_cx":0.86,"m_egg":0.843,"m_air":0.329,"m_acorn":0.912,"m_t1":0.507,"m_t2":1,"m_t3":0.422,"fl":{"kz":1,"scout":1},"fav":{"duck":0.38,"humbee":0.33,"phoenix":0.25,"crane":0.36,"egg_legs":0.03,"peacock":0.08,"ghostcrow":0.41,"eagle":0.15}},"up":{"tw0":4.063,"twRate":1.275,"inc0":41.623,"incRate":45.628,"uShare":0.761,"uAir":0.076,"uHeavy":0.133,"uTier":0.89,"uSpec":0.31,"wall":0.239,"upAgg":0.628,"upMax":3.131,"def8":1.277,"crisis":38.667,"rush":223.191,"keep":100,"tech":0.5,"tech2":2.5,"m_cx":0.855,"m_egg":1,"m_air":0,"m_acorn":0.826,"m_t1":0.973,"m_t2":0.818,"m_t3":0.46,"fl":{"kz":1},"fav":{"duck":0.11,"humbee":0.33,"phoenix":0.25,"egg_legs":0.03,"kiwi":0.38}}},ALPHA_ARCH_SK={"inc":{"tw0":5.103,"twRate":3.493,"wall":0.27,"upAgg":0,"upMax":2.54,"def8":1.3,"crisis":37.867,"rush":150,"keep":152.548,"m_cx":0.74},"def":{"tw0":6.083,"twRate":2.762,"wall":0.392,"upAgg":0,"upMax":3,"def8":1.3,"crisis":28.139,"rush":150,"keep":140.142,"m_cx":0.964},"rush":{"tw0":3.901,"twRate":2.806,"wall":0.402,"upAgg":0.046,"upMax":3.129,"def8":1.3,"crisis":28.687,"rush":150,"keep":128.213,"m_cx":0.951},"air":{"tw0":4.178,"twRate":2.645,"wall":0.439,"upAgg":0.034,"upMax":2.67,"def8":1.3,"crisis":23.893,"rush":150,"keep":100,"m_cx":0.86},"up":{"tw0":4.063,"twRate":1.275,"wall":0.239,"upAgg":0.628,"upMax":3.131,"def8":1.277,"crisis":38.667,"rush":223.191,"keep":100,"m_cx":0.855}};
const ALPHA_SKILL={"tw0": 3.842, "twRate": 2.66, "wall": 0.395, "upAgg": 0.024, "upMax": 2.871, "def8": 1.276, "crisis": 26.002, "rush": 195.9, "keep": 115.109, "m_cx": 0.945};
const AIP=(()=>{const by=n=>AIS.find(a=>a.n===n).g,B={...by('폭풍 전략가'),def8:.95,rush:430,keep:380},L=[];
 // 스타일은 밸런스형(폭풍 전략가)을 바탕으로 적당히만 기울여요(극단값은 AI끼리 싸울 때 한쪽이 독식해서)
 const ST=[['이자형',{...B,inc0:66,incRate:48,uShare:.64,uTier:.72,uHeavy:.6,def8:.9,upAgg:.45,rush:390,keep:320}],
  ['안정형',{...B,tw0:5.5,twRate:1.9,def8:1.0,upAgg:.65,inc0:66,incRate:56,uShare:.72,crisis:34,rush:450,keep:400}],
  ['밸런스형',{...B}]];
 const SN={steam:'증기',plasma:'플라즈마',firestorm:'화염폭풍',pyre:'역병',aurora:'절대영도',whiteout:'눈사태',frostbane:'빙독',tempest:'폭풍',venomvolt:'신경독',miasma:'독안개'};
 COMBO.forEach(c=>ST.forEach(([sn,g])=>L.push({n:`${SN[c.t]||c.n} ${sn}`,g:{...g,tech:TK.indexOf(c.k[0])+.5,tech2:TK.indexOf(c.k[1])+.5}})));
 L.push({n:'수상한 알 전략',g:{...B,inc0:70,incRate:52,uShare:.7,uTier:.72,uHeavy:.5,def8:.92,tech:undefined,tech2:undefined},fav:{egg_legs:1.6,kiwi:.6,turkey:.8}});// 싼 알을 쉴 새 없이
 L.push({n:'공작새 치유 전략',g:{...B,uShare:.78,uTier:.9,uHeavy:.8,tech:undefined,tech2:undefined},fav:{peacock:4,crane:3,duck:1,dodo:1,goose:.8}});// 치유 공작 + 튼튼한 새
 ['중장갑 러시','특수 조류 조련사','미로 설계자'].forEach(n=>L.push(AIS.find(a=>a.n===n)));
 L.push({n:'올인 타이밍',g:{...B,inc0:72,incRate:54,uShare:.7,uTier:.72,def8:.98,upAgg:.5,rush:400,keep:1800,tech:undefined,tech2:undefined}});// 피해 2배(7분) 직전까지 모았다가 몰아치기
 // 🧠 지능형(헬 전용): 이자형 운영을 바탕으로 각자 기술을 더해요 — 정찰 카운터 · 킬존 · 재배치 미로
 const EG=ST[0][1];
 L.push({n:'정찰 카운터',hell:1,fl:{scout:1},g:{...EG,tech:undefined,tech2:undefined}});
 L.push({n:'킬존 설계자',hell:1,fl:{kz:1},g:{...EG,upAgg:.65,tech:undefined,tech2:undefined}});
 L.push({n:'재배치 미로',hell:1,fl:{jug:1,kz:1},g:{...EG,tech:undefined,tech2:undefined}});
 /* 🤖 알파고 성향(2026-11-11 자기 대국 진화 1,440판, tools/sim/evolve.js): 빙결+폭풍, 업그레이드 거의 안 하고 타워·벽·미로를 촘촘히. 너무 세서 어려움·헬·알파고에서만(alpha:1) */
 const AN=['알파 눈사태','알파 킬존','알파 미로술사','알파 정찰병','알파 철벽','알파 속공','알파 계산기','알파 신예'];
 ALPHA.forEach((g,i)=>{const{fav,fl,...gg}=g;L.push({n:AN[i]||'알파 '+i,alpha:1,hell:1,fl:fl||{},fav:fav||{},g:gg})});
 [['inc','알파 이자형'],['def','알파 안정형'],['rush','알파 러시'],['air','알파 공중함대'],['up','알파 장인']].forEach(([k,n])=>{const{fav,fl,...gg}=ALPHA_ARCH[k];L.push({n,alpha:1,hell:1,fl:fl||{},fav:fav||{},g:gg})});
 return L})();

// ---------- 로직 (육각 타일: 홀수 줄이 오른쪽으로 반 칸 밀린 6방향 격자) ----------
const HH=.866025,BH=ROWS*HH,cellX=(c,r)=>c+.5+(r&1?.5:0),cellY=r=>(r+.5)*HH,EY=cellY(ROWS-1)-.05,HALF=BH*.5;
const NBR=[[[1,0],[-1,0],[-1,-1],[0,-1],[-1,1],[0,1]],[[1,0],[-1,0],[0,-1],[1,-1],[0,1],[1,1]]],
 NBR2=[[[-1,0],[1,0],[0,-1],[-1,-1],[0,1],[-1,1]],[[-1,0],[1,0],[1,-1],[0,-1],[1,1],[0,1]]]; // 좌우 순서를 뒤집은 판: 길찾기마다 무작위로 골라 편향 제거
function nearCell(x,y){const r0=Math.max(0,Math.min(ROWS-1,Math.round(y/HH-.5)));let b=[0,r0],bd=1e9;
 for(let r=Math.max(0,r0-1);r<=Math.min(ROWS-1,r0+1);r++)for(let c=0;c<COLS;c++){const d=Math.hypot(x-cellX(c,r),y-cellY(r));if(d<bd){bd=d;b=[c,r]}}
 return{x:b[0],y:b[1],d:bd}}
function bfs(g,sx,sy){const q=[[sx,sy]],par={},seen=new Set([sx+','+sy]),NB=Math.random()<.5?NBR:NBR2;
 for(let i=0;i<q.length;i++){const[x,y]=q[i];
  if(y===ROWS-1){const p=[];let c=[x,y];while(c){p.unshift({x:c[0],y:c[1]});c=par[c[0]+','+c[1]]}return p}
  for(const[dx,dy]of NB[y&1]){const nx=x+dx,ny=y+dy,k=nx+','+ny;
   if(nx<0||nx>=COLS||ny<0||ny>=ROWS||seen.has(k)||g[ny][nx])continue;seen.add(k);par[k]=[x,y];q.push([nx,ny])}}
 return null}
const allOK=g=>{let s=0;for(let x=0;x<COLS;x++){const p=bfs(g,x,0);if(!p)return 0;s+=p.length}return s};
const mk=b=>({bp:b,lv:1,d:b.d,r:b.r,inv:b.c,cd:0,dis:0});
const upc=(t,p)=>Math.floor(t.bp.c*BAL.upk*t.lv*(1+BAL.upg*(t.lv-1))*((rOf(p)&&rOf(p).upc)||1));
const rOf=p=>p&&p.race?RACE[p.race]:null,raceOK=(p,x)=>{const r=rOf(p);return(!x.race||x.race===p.race)&&!(r&&r.ban&&r.ban.includes(x.id))},
 tcost=(p,b)=>Math.max(1,Math.round(b.c*((rOf(p)&&rOf(p).tc)||1))),ucost=(p,b)=>Math.max(1,Math.round(b.c*((rOf(p)&&rOf(p).uc)||1))),refR=p=>(rOf(p)&&rOf(p).ref)||.7,
 mkR=(b,p)=>{const t=mk(b),r=rOf(p);if(r&&r.tr&&b.r)t.r+=r.tr;return t};
function raceAssign(gs){if(gs&&gs.races)return gs.races;if(!gs&&gameMode==='normal')return Array(8).fill(null);const a=[];RK_KEYS.forEach(k=>{a.push(k,k)});for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}if(!gs){const j=a.indexOf(raceSel);[a[0],a[j]]=[a[j],a[0]]}return a}
/* 한국어 조사: 마지막 글자 받침이 있으면 a(을·은·이), 없으면 b(를·는·가) */
const jo=(w,a,b)=>{const c=String(w).replace(/[^가-힣0-9A-Za-z]+$/,'').slice(-1),k=c.charCodeAt(0);if(k>=0xAC00&&k<=0xD7A3)return w+((k-0xAC00)%28?a:b);return w+(/[136780LMNRlmnr]$/.test(c)?a:b)};
const banOf=(p,x)=>{const r=rOf(p);return !!(r&&r.ban&&r.ban.includes(x.id))},banMsg=(p,x)=>{const r=rOf(p);return `🚫 ${r.ic} ${jo(r.n,'은','는')} ${jo(x.n,'을','를')} 쓸 수 없어요 (종족 규칙)`};
const has=(p,k)=>p.tech===k||p.tech2===k,techOK=(p,x)=>(!x.tech||has(p,x.tech))&&(!x.combo||(has(p,x.combo[0])&&has(p,x.combo[1])))&&raceOK(p,x),hasBat=p=>has(p,'dark');
/* 🛡 보호막이 남아 있으면 독·화상·감속에 안 걸림 */const SHIM={poison:1,burn:1,slow:1},im=(u,k)=>(u.sh>0&&!!SHIM[k])||!!(u.bp.imm&&u.bp.imm.includes(k)),comboOf=(a,b)=>COMBO.find(c=>c.k.includes(a)&&c.k.includes(b)),tIcons=p=>(p.tech?TECH[p.tech].ic:'')+(p.tech2?TECH[p.tech2].ic:'');
const cnt=g=>g.flat().filter(Boolean).length;
let S=null,diff='M',sel=null,view=0,insp=null,spd=1,paused=false,over=false,uid=0;

function nextAlive(i){for(let k=1;k<=8;k++){const n=(i+k)%8;if(S.pl[n].alive&&n!==i)return n}return null}
const cctvN=p=>p.grid.flat().filter(t=>t&&t.bp&&t.bp.cctv).length,cctvOK=p=>(p.sawSt||S.t>=240)&&cctvN(p)<2;
function spawnAt(t,b,owner,hp,x,y,ex){const c=nearCell(x,y);if(b.stealth&&!t.sawSt&&owner!==t.id){t.sawSt=1;if(t.id===0&&!S.sim){toast('🦉 은신 새 목격! 이제 부엉이 CCTV를 지을 수 있어요');sfx('unlock',{k:'cctv'});try{ui()}catch(e){}}}
 const u={id:++uid,bp:b,owner,hp:hp??b.hp,x,y,path:b.t==='G'?(bfs(t.grid,c.x,c.y)||[]):null,pi:0,slow:0,stun:0,pois:0,pd:0,amp:0,hit:0,sh:b.shield||0,rv:b.revive?1:0,pk:1,hatch:0,hd:0,gold:0,col:0};
 if(ex)Object.assign(u,ex);t.units.push(u);return u}
function spawn(t,b,owner,hp,ex){const x=Math.floor(Math.random()*COLS),first=hp===undefined;if(hp===undefined&&S.pl[owner]&&S.pl[owner].ai){const uh=DIFF[diff].uh;if(uh)hp=b.hp*uh}
 {const rm=rOf(S.pl[owner]);ex=Object.assign({},ex);if(rm){if(first&&rm.uhp)hp=(hp===undefined?b.hp:hp)*rm.uhp;if(rm.spd)ex.spm=rm.spd;if(rm.rv&&b.c>=rm.rv&&ex.rv===undefined)ex.rv=1}}
 if(t.id===0&&owner!==0&&b.c>=280&&!S.sim&&S.t-(S.la||-9)>4){S.la=S.t;toast(`🚨 ${S.pl[owner].name}의 ${b.n} 접근!`)}
 return spawnAt(t,b,owner,hp,cellX(x,0),cellY(0),ex)}
const gainInc=(p,b)=>Math.max(1,Math.round(b.inc*BAL.ui*BAL.incS/(BAL.incS+p.income))),lateMul=()=>S.t>=BAL.late2?BAL.lm2:S.t>=BAL.late1?BAL.lm1:1;
function kbU(u,n,force){if(!force&&(im(u,'kb')||u.kbt>0))return;if(u.bp.t==='G'&&u.pi>1)u.pi=Math.max(0,u.pi-2*n);else u.y=Math.max(cellY(0),u.y-1.1*n);u.kbt=7+Math.random()*3}
function addPois(u,pv,src){u.pst=Math.min(BAL.pmax,(u.pst||0)+1);u.ps=BAL.pdur;if(pv>=(u.pv||0)){u.pv=pv;u.psrc=src}}
/* zap: ⚡ 뇌전(번개) 공격은 보호막에 2배 */function dmgU(u,d,zap){if(u.amp>0)d*=1.35;const h0=Math.max(0,u.hp)+Math.max(0,u.sh||0),d0=d;if(u.sh>0){const k=zap?BAL.shz:1,a=Math.min(u.sh,d*k);u.sh-=a;d-=a/k;if(zap&&u.sh<=0)u.shb=1}u.hp-=d;u.hit=.1;return Math.min(h0,d0)}
/* 🏗 공사 고깔: 두루미가 타워를 이고 간 동안 원래 자리에 세워 둬요(그 칸은 여전히 막혀 있어요) */
const CONE=new Map();function craneCone(t,x,y){if(!t){CONE.forEach((c,tt)=>{if(!tt.carrier||!c.on){Sc.remove(c.m);CONE.delete(tt)}else c.on=0});return}
 let c=CONE.get(t);if(!c){const g=new THREE.Group(),o=new THREE.Mesh(new THREE.ConeGeometry(.16,.42,10),new THREE.MeshStandardMaterial({color:0xf97316}));o.rotation.x=PI/2;o.position.z=.21;g.add(o);
  const w=new THREE.Mesh(new THREE.CylinderGeometry(.12,.135,.06,10),new THREE.MeshStandardMaterial({color:0xffffff}));w.rotation.x=PI/2;w.position.z=.2;g.add(w);Sc.add(g);c={m:g};CONE.set(t,c)}c.on=1;c.m.position.set(x,y,0)}
/* 🏗 철거반장이 든 타워 내려놓기: Lv.2 이하면 두루미 근처 빈칸 중 미로·새 길을 막지 않는 곳으로, 아니면 제자리 */
function craneDrop(p,u,move){const c=u.carry;if(!c)return;u.carry=null;const t=c.t;t.carrier=null;t.dis=.6;if(!p.grid[c.oy]||p.grid[c.oy][c.ox]!==t)return;
 if(move&&t.lv<=2){const cs=[];for(let y=1;y<ROWS-1;y++)for(let x=0;x<COLS;x++){if(p.grid[y][x])continue;const d=Math.hypot(cellX(x,y)-u.x,cellY(y)-u.y);if(d<=2.6&&!(x===c.ox&&y===c.oy))cs.push([d,x,y])}cs.sort((a,b)=>a[0]-b[0]);
  for(const[,x,y]of cs){if(p.units.some(o=>Math.hypot(o.x-cellX(x,y),o.y-cellY(y))<.6))continue;p.grid[c.oy][c.ox]=null;p.grid[y][x]=t;
   const ok=allOK(p.grid)&&p.units.every(o=>{if(o.bp.t!=='G'||o===u&&false)return true;const n=nearCell(o.x,o.y);return !!bfs(p.grid,n.x,n.y)});
   if(ok){refreshPaths(p);if(p.id===view&&!S.sim){sfx('build');artFx('smoke',{x:cellX(x,y),y:BH-cellY(y),r:.7,col:0xfacc15});if(p.id===0)toast(`🏗 철거반장이 ${jo(t.bp.n,'을','를')} 옮겼어요! "불법 건축물이에요~"`)}return}
   p.grid[y][x]=null;p.grid[c.oy][c.ox]=t}}
 if(p.id===view&&!S.sim)artFx('smoke',{x:cellX(c.ox,c.oy),y:BH-cellY(c.oy),r:.5,col:0xd6c7a1})}
/* 🦖 시조새 착지: 가장 가까운 빈칸에 내려와 지상형으로 바뀌고, 주변 타워 2초 기절 */
function fossilLand(p,u){const cs=[];for(let y=0;y<ROWS;y++)for(let x=0;x<COLS;x++)if(!p.grid[y][x])cs.push([Math.hypot(cellX(x,y)-u.x,cellY(y)-u.y),x,y]);cs.sort((a,b)=>a[0]-b[0]);
 for(const[,x,y]of cs.slice(0,12)){const np=bfs(p.grid,x,y);if(!np)continue;const ax=u.x,ay=u.y,r=u.hp/u.bp.hp;u.bp=UB.archaeo_g;u.hp=u.bp.hp*r;u.path=np;u.pi=0;u.gr=0;u.x=cellX(x,y);u.y=cellY(y);
  p.grid.forEach((row,ty)=>row.forEach((t,tx)=>{if(t&&t.bp.d&&Math.hypot(cellX(tx,ty)-u.x,cellY(ty)-u.y)<1.8)t.dis=Math.max(t.dis||0,2)}));
  if(p.id===view&&!S.sim){sfx('hatch',{to:'hatch_dino'});u.popT=S.t+.5;/* 1) 하늘의 돌 화석이 금 가며 깨짐 → 2) 내려온 칸에 뼈 화석 돌판 → 3) 그 위에서 깨어난 시조새 */if(PXS.has('nature/fossil-crack')){PXS.play('nature/fossil-crack',ax,BH-ay,.6,{fit:3})}else PXS.play('impacts/ground-slam',u.x,BH-u.y,0,{fit:3.6});artFx('smoke',{x:u.x,y:BH-u.y,r:1.8,col:0xd6c7a1});setTimeout(()=>artFx('hatch',{u}),500);if(p.id===0)toast('🦖 화석이 깨지고 시조새가 깨어났어요! · 주변 타워 2초 기절')}return}}
function refreshPaths(p){p.units.forEach(u=>{if(u.bp.t!=='G')return;const c=nearCell(u.x,u.y),np=bfs(p.grid,c.x,c.y);if(np){u.path=np;u.pi=0}})}
function toast(m){const e=$('toast');e.textContent=m;e.style.display='block';clearTimeout(toast.t);toast.t=setTimeout(()=>e.style.display='none',2400)}

// 🌐 행동은 '누가(pid)' 하는지 받아요: 0번은 이 기기, 그 밖은 온라인 손님(방장이 대신 처리)
const netG=()=>!!(S&&S.net==='guest'),say=(pid,m)=>{if(pid===0)toast(m);else if(typeof NET!=='undefined')NET.tell(pid,m)};
const cntOf=b=>b.cntR?b.cntR[0]+Math.floor(Math.random()*(b.cntR[1]-b.cntR[0]+1)):(b.count||1);
function send(b){if(netG()){if(!S.pl[0].alive)return toast('👀 관전 중이에요');if(S.cdn>0)return toast('⏱ 카운트다운 중엔 속성만 고를 수 있어요');sfx('send',{unit:b.id});return NET.cmd({a:'send',b:b.id})}actSend(0,b.id)}
function actSend(pid,bid){const me=S.pl[pid],b=UB[bid],loc=pid===0;if(!me||!b)return;if(!me.alive)return say(pid,'👀 관전 중이에요');
 if(b.hidden||(b.secret&&!eggHasP(me,b.secret)))return;
 if(!techOK(me,b))return say(pid,b.race?`${RACE[b.race].ic} ${RACE[b.race].n} 전용 새예요`:b.tech?`${TECH[b.tech].ic} ${TECH[b.tech].n} 테크 전용 새예요`:banMsg(me,b));
 if(S.cdn>0)return say(pid,'⏱ 카운트다운 중엔 속성만 고를 수 있어요');
 const bc=ucost(me,b);if(me.gold<bc)return say(pid,`💰 골드가 부족해요 (${bc}G 필요)`);
 const gi=gainInc(me,b);me.gold-=bc;me.income+=gi;const n=nextAlive(pid);
 if(b.id==='egg_legs'){if(n!==null){const tw=eggHasP(me,'twin')&&Math.random()<.25;for(let k=0;k<(tw?2:1);k++){const g=eggHasP(me,'gold')&&Math.random()<.1;spawn(S.pl[n],b,pid,undefined,{hatch:eggHasP(me,'hatch')?1:0,gold:g?1:0,col:g?0xfacc15:0})}}
  if(!loc){me.egg=(me.egg||0)+1;const m2=!me.ai&&EGGM.find(m=>m.n===me.egg);return say(pid,m2?`${m2.ic} 해금! ${m2.t} — ${m2.d}`:`🥚 수상한 알 소환! (인컴 +${gi})`)}
  EGG.n++;const m=EGGM.find(m=>m.n===EGG.n);
  if(m){sfx('unlock',{k:m.k});artFx('unlock',{k:m.k});toast(`${m.ic} 해금! ${m.t} — ${m.d}`);ui();return}
  sfx('send',{unit:b.id});const nx=eggNext();return toast(nx?`🥚 수상한 알 ${EGG.n}/${nx.n} · 다음: ${nx.ic}${nx.t}`:`🥚 수상한 알 ${EGG.n}개 · 연구소 완전 해금!`)}
 if(n!==null){const cn=cntOf(b);for(let k=0;k<cn;k++)spawn(S.pl[n],b,pid)}
 if(loc)sfx('send',{unit:b.id});say(pid,`🕊️ ${b.n} 소환! (인컴 +${gi})${b.x?' · '+b.x:''}`)}
function hatchOf(u){if(u.gold)return UB.hatch_gold;if(eggHasP(S.pl[u.owner],'dino')&&Math.random()<.03)return UB.hatch_dino;const o=S.pl[u.owner],ks=[o.tech,o.tech2].filter(Boolean);
 return ks.length?UB['hatch_'+ks[Math.floor(Math.random()*ks.length)]]:UB.hatch_chick}

function cell(x,y){
 if(view!==0||!S.pl[0].alive)return toast('관전 중에는 건설할 수 없어요');
 const me=S.pl[0],t=me.grid[y][x];
 if(t){insp={x,y,t};sel=null;return ui()}
 if(!sel){insp=null;return ui()}
 if(S.cdn>0){sel=null;ui();return toast('⏱ 카운트다운 중엔 속성만 고를 수 있어요')}
 if(!techOK(me,sel)){sel=null;ui();return toast('선택한 테크의 타워만 지을 수 있어요')}
 if(sel.cctv&&!cctvOK(me)){const m=cctvN(me)>=2?'부엉이 CCTV는 최대 2개까지예요':'🔒 은신 새를 한 번 목격하거나 4분이 지나야 지을 수 있어요';sel=null;ui();return toast(m)}
 if(y===0||y===ROWS-1)return toast('⚠️ 첫 줄과 마지막 줄에는 건설할 수 없어요');
 if(me.gold<tcost(me,sel)){sel=null;ui();return toast('골드가 부족해요')}
 if(netG()){me.grid[y][x]=mkR(sel,me);const ok=allOK(me.grid);me.grid[y][x]=null;if(!ok)return toast('⚠️ 길이 막혀서 건설할 수 없어요');NET.cmd({a:'build',x,y,t:sel.id});sfx('build',{tower:sel.id});sel=null;return ui()}
 actBuild(0,x,y,sel.id);sel=null;ui()}
function actBuild(pid,x,y,tid){const me=S.pl[pid],b=TB[tid];if(!me||!me.alive||!b||S.cdn>0||y<=0||y>=ROWS-1||x<0||x>=COLS||me.grid[y][x])return;
 if(!techOK(me,b))return say(pid,'선택한 테크의 타워만 지을 수 있어요');if(b.cctv&&!cctvOK(me))return say(pid,'부엉이 CCTV는 아직 지을 수 없어요');if(me.gold<tcost(me,b))return say(pid,'골드가 부족해요');
 me.grid[y][x]=mkR(b,me);if(!allOK(me.grid)){me.grid[y][x]=null;return say(pid,'⚠️ 길이 막혀서 건설할 수 없어요')}
 me.gold-=tcost(me,b);if(pid===0)sfx('build',{tower:b.id});refreshPaths(me)}
function upg0(){if(netG()){NET.cmd({a:'upg',x:insp.x,y:insp.y});return sfx('upgrade',{tower:insp.t.bp.id,lv:insp.t.lv+1})}actUpg(0,insp.x,insp.y);ui()}
function actUpg(pid,x,y){const me=S.pl[pid],t=me&&me.grid[y]&&me.grid[y][x];if(!t||!me.alive)return;const c=upc(t,me);
 if(t.lv>=4)return say(pid,'최대 레벨이에요');if(me.gold<c)return say(pid,'골드가 부족해요');
 const old=tName(t);me.gold-=c;t.lv++;t.d=Math.floor(t.d*1.6);t.r+=.25;t.inv+=c;if(pid===0)sfx('upgrade',{tower:t.bp.id,lv:t.lv});
 const nw=tName(t);say(pid,nw!==old?`🧬 ${old} → ${nw} 진화!`:`⬆️ ${nw} Lv.${t.lv}`);if(pid===view)artFx('evolve',{x:cellX(x,y),y:BH-cellY(y),lv:t.lv,b:t.bp})}
function dem0(){sfx('sell');if(netG())NET.cmd({a:'dem',x:insp.x,y:insp.y});else actDem(0,insp.x,insp.y);insp=null;ui()}
function actDem(pid,x,y){const me=S.pl[pid],t=me&&me.grid[y]&&me.grid[y][x];if(!t||!me.alive)return;me.gold+=Math.floor(t.inv*refR(me));me.grid[y][x]=null;refreshPaths(me)}

// ---------- 조합 스킬 (속성 2개 필요, 해금 SKC골드) ----------
const SKC=1500,SKILL={
 steam:{n:'증기 폭발',d:'모든 적에게 최대체력 30% 피해 + 4초 감속',cd:55,f:p=>((!S.sim&&p.id===view&&typeof PFX!=='undefined')&&PFX.many('steam',p.units),0)||p.units.forEach(u=>{dmgU(u,u.bp.hp*.3);u.slow=Math.max(u.slow,4)})},
 plasma:{n:'플라즈마 낙뢰',d:'무작위 적에게 낙뢰 12회 (최대체력 25%+화상)',cd:55,f:p=>{for(let k=0;k<12&&p.units.length;k++){const u=p.units[Math.floor(Math.random()*p.units.length)];if(!S.sim&&p.id===view){if(PXS.has('lightning/lightning-strike'))PXS.play('lightning/lightning-strike',u.x,BH-u.y,0,{fit:2.2,delay:k*.09});else if(typeof PFX!=='undefined')PFX.strike(u.x,BH-u.y,u.bp.t==='A'?1.2:0,k*.09)}dmgU(u,u.bp.hp*.25+300,1);u.pois=3;u.pd=60;u.bc=true}}},
 firestorm:{n:'화염 폭풍',d:'모든 적 6초 강한 화상 + 밀어내기',cd:60,f:p=>((!S.sim&&p.id===view&&typeof PFX!=='undefined')&&(PFX.many('fire',p.units),PXS.some('fire/flame-pillar',p.units,8,{fit:1.6})),0)||p.units.forEach(u=>{u.pois=6;u.pd=u.bp.hp*.05;u.bc=true;kbU(u,2)})},
 pyre:{n:'역병의 불길',d:'모든 적 8초 독화상 + 받는 피해 +35%',cd:60,f:p=>((!S.sim&&p.id===view&&typeof PFX!=='undefined')&&PFX.many('gfire',p.units),0)||p.units.forEach(u=>{u.pois=8;u.pd=u.bp.hp*.04;u.bc=true;u.amp=8})},
 aurora:{n:'절대영도',d:'모든 적 3초 빙결 (면역 무시)',cd:60,f:p=>((!S.sim&&p.id===view&&typeof PFX!=='undefined')&&(PFX.many('ice',p.units),PXS.some('ice/ice-shatter',p.units,10,{fit:1.4,delay:2.7})),0)||p.units.forEach(u=>{u.stun=Math.max(u.stun,3)})},
 whiteout:{n:'눈사태',d:'모든 적을 크게 밀어내고 6초 감속',cd:60,f:p=>((!S.sim&&p.id===view&&typeof PFX!=='undefined')&&PFX.many('snow',p.units,.07),0)||p.units.forEach(u=>{kbU(u,3,true);u.slow=Math.max(u.slow,6)})},
 frostbane:{n:'빙독 감옥',d:'모든 적 8초 감속 + 독(초당 최대체력 3%)',cd:55,f:p=>((!S.sim&&p.id===view&&typeof PFX!=='undefined')&&PFX.many('cage',p.units),0)||p.units.forEach(u=>{u.slow=Math.max(u.slow,8);u.pois=8;u.pd=u.bp.hp*.03;u.bc=false})},
 tempest:{n:'폭풍의 눈',d:'10초간 내 모든 타워 공격속도 2배',cd:60,f:p=>{(!S.sim&&p.id===view&&typeof PFX!=='undefined')&&(PFX.towers('wind',p),PXS.towers('nature/tornado',p,4,{fit:1.7,loop:true,life:3}));p.boost=10}},
 venomvolt:{n:'신경독 전류',d:'모든 적 최대체력 20% 피해 + 2초 기절 + 약화',cd:60,f:p=>((!S.sim&&p.id===view&&typeof PFX!=='undefined')&&PFX.many('zap',p.units,.03),0)||p.units.forEach(u=>{dmgU(u,u.bp.hp*.2,1);u.stun=Math.max(u.stun,2);u.amp=8})},
 miasma:{n:'독안개 장막',d:'10초간 은신 해제 + 감속 + 독',cd:55,f:p=>{(!S.sim&&p.id===view&&typeof PFX!=='undefined')&&PFX.board('fog',16);p.reveal=10;p.units.forEach(u=>{u.slow=Math.max(u.slow,10);u.pois=10;u.pd=u.bp.hp*.02;u.bc=false})}}};
function skillOf(p){if(!p.tech2)return null;const c=comboOf(p.tech,p.tech2);return c?Object.assign({id:c.t,c},SKILL[c.t]):null}
function useSkill(p){const s=skillOf(p);if(!s||!p.skU||p.skCD>0)return false;s.f(p);p.skCD=s.cd;p.skN=(p.skN||0)+1;if(p.id===view||p.id===0)sfx('skill',{id:s.id,mine:p.id===0});if(p.id===view)artFx('skill',{id:s.id,col1:TECH[s.c.k[0]].col,col2:TECH[s.c.k[1]].col});if(p.id===view&&!S.sim)skFx(s);if(p.id===0&&!S.sim)toast(`${s.c.ic} ${s.n} 발동!`);return true}

// ---------- AI: 전략 유전자 ----------
const GK={tw0:[3,14],twRate:[0,4],inc0:[30,140],incRate:[0,60],uShare:[.2,1],uAir:[0,1],uHeavy:[0,1],uTier:[.2,1],uSpec:[0,1],wall:[0,.7],
 upAgg:[0,1],upMax:[2,4],def8:[.2,1.3],crisis:[20,70],rush:[150,900],keep:[100,800],tech:[0,4.999],tech2:[0,4.999],m_cx:[0,1],
 m_egg:[0,1],m_air:[0,1],m_acorn:[0,1],m_t1:[0,1],m_t2:[0,1],m_t3:[0,1]};
function randG(){const g={};for(const k in GK)g[k]=GK[k][0]+Math.random()*(GK[k][1]-GK[k][0]);return g}
function mutG(g,s){const o={};for(const k in GK){const[a,b]=GK[k];o[k]=Math.max(a,Math.min(b,(g[k]??(a+b)/2)+(Math.random()+Math.random()+Math.random()-1.5)*2*s*(b-a)))}return o}
function crossG(a,b){const o={};for(const k in GK)o[k]=Math.random()<.5?a[k]:b[k];return o}
const fx2=b=>(b.rapid?1.25:1)*(b.heavy?1.15:1)+(b.poison?.8:0)+(b.burn?.8:0)+(b.stun?.5:0)+(b.slow?.5:0)+(b.chain?b.chain*.25:0)+(b.freeze?.4:0)+(b.amp?.6:0)+(b.self?1:0)+(b.splash?.4:0)+(b.bubble?.6:0);
function defPow(p){const ps=[0,2,COLS-1].map(x=>bfs(p.grid,x,0)).filter(Boolean);if(!ps.length)return 0;let tot=0;
 p.grid.forEach((row,y)=>row.forEach((t,x)=>{if(!t||!t.d||t.bp.t==='A')return;const tx=cellX(x,y),ty=cellY(y);let n=0;
  ps.forEach(pa=>pa.forEach(q=>{if(Math.hypot(cellX(q.x,q.y)-tx,cellY(q.y)-ty)<=t.r)n++}));n/=ps.length;
  tot+=t.d/t.bp.cd*n/.7*fx2(t.bp)*(t.bp.pylon?.45*pyMul(p,x,y):1)}));return tot}
// ⚡ 참새 전봇대: 이웃한 전봇대끼리 전깃줄. 연결된 무리 크기 n → 배수 min(3, 1+0.25·(n-1))
function pyComp(p){const g=p.grid,id={},sz=[];let k=0;for(let y=0;y<ROWS;y++)for(let x=0;x<COLS;x++){const t=g[y][x];if(!t||!t.bp||!t.bp.pylon||id[x+','+y]!==undefined)continue;
  const q=[[x,y]];id[x+','+y]=k;let n=0;while(q.length){const[a,b]=q.pop();n++;for(const[dx,dy]of NBR[b&1]){const nx=a+dx,ny=b+dy,kk=nx+','+ny,o=g[ny]&&g[ny][nx];if(o&&o.bp&&o.bp.pylon&&id[kk]===undefined){id[kk]=k;q.push([nx,ny])}}}sz.push(n);k++}
 return{id,sz}}
const pyMul=(p,x,y)=>{const c=p.pyc||pyComp(p),i=c.id[x+','+y];return i===undefined?1:Math.min(3,1+.25*(c.sz[i]-1))};
function pyWires(p){const c=pyComp(p);p.pyc=c;const W=[];for(let y=0;y<ROWS;y++)for(let x=0;x<COLS;x++){const t=p.grid[y][x];if(!t||!t.bp||!t.bp.pylon)continue;
  for(const[dx,dy]of NBR[y&1]){const nx=x+dx,ny=y+dy;if(ny<y||(ny===y&&nx<x))continue;const o=p.grid[ny]&&p.grid[ny][nx];if(o&&o.bp&&o.bp.pylon)W.push({a:t,b:o,x1:cellX(x,y),y1:cellY(y),x2:cellX(nx,ny),y2:cellY(ny),m:Math.min(3,1+.25*(c.sz[c.id[x+','+y]]-1))})}}
 p.wires=W;return W}
const segD=(px,py,w)=>{const dx=w.x2-w.x1,dy=w.y2-w.y1,l=dx*dx+dy*dy,t=Math.max(0,Math.min(1,((px-w.x1)*dx+(py-w.y1)*dy)/l));return Math.hypot(px-w.x1-t*dx,py-w.y1-t*dy)};
const need8=t=>Math.max(0,Math.min(1,(t-90)/390))*27000*BAL.need;
function pickTower(p,g){const l=T.filter(b=>b.id!=='wall'&&techOK(p,b)&&tcost(p,b)<=p.gold&&(!b.cctv||(p.sawSt&&cctvOK(p))));if(!l.length)return null;
 let tot=0;const w=l.map(b=>{const v=(b.combo?(g.m_cx??.8):b.tech?g['m_t'+(TECH[b.tech].t.indexOf(b.id)+1)]:(g['m_'+b.id]??(b.pylon?.25:b.cctv?.9:.3)))+.02;tot+=v;return v});let r=Math.random()*tot;
 for(let i=0;i<l.length;i++){r-=w[i];if(r<=0)return l[i]}return l[l.length-1]}
// 🐍 AI 미로 설계도(숙련 이상): 칸 목록을 위에서부터 순서대로 지어요. 길이 막히는 칸은 건너뛰어요.
//   길이(7개 입구 평균, 빈 판 16칸): 가로 뱀 48 · 혼합 44 · 넓은 세로 42 · 세로 40 · 대각선 36 · 빗살 35 · 넓은 가로 30
const MZ=(()=>{const C=COLS,Y=ROWS,rng=(a,b)=>{const o=[];for(let i=a;i<=b;i++)o.push(i);return o},row=(y,xs)=>xs.map(x=>[x,y]),col=(x,ys)=>ys.map(y=>[x,y]);
 const hs=ys=>{const o=[];ys.forEach((y,r)=>{const g=r%2?0:C-1;rng(0,C-1).forEach(x=>{if(x!==g)o.push([x,y])})});return o};
 return{
  hsnake:{n:'가로 뱀',f:()=>hs([2,4,6,8,10,12,14])},
  hsnake2:{n:'홀수 줄 가로 뱀',f:()=>hs([1,3,5,7,9,11,13])},// 8번 줄 가운데 알 타워를 철거해야 완성돼요
  mix:{n:'혼합 미로',f:()=>[...hs([2,4,6]),...row(8,rng(1,6)),...col(1,rng(9,12)),...col(3,rng(10,13)),...col(5,rng(9,12)),...row(14,rng(0,5))]},
  vsnake:{n:'세로 뱀',f:()=>[...row(1,rng(1,6)),...col(1,rng(2,11)),...col(3,rng(3,13)),...col(5,rng(2,11)),...row(14,rng(0,5))]},
  wvsnake:{n:'넓은 세로 뱀',f:()=>[...row(1,rng(1,6)),...col(1,rng(2,12)),...col(4,rng(3,13)),...row(14,rng(0,4))]},
  diag:{n:'대각선 뱀',f:()=>{const o=[];[1,4,7,10].forEach((y0,k)=>{const ch=[];let x=0,y=y0;ch.push([x,y]);while(true){x++;if(x>=C)break;ch.push([x,y]);const nx=y%2?x+1:x;y++;if(nx>=C||y>Y-2)break;x=nx;ch.push([x,y])}(k%2?ch.slice(1):ch.slice(0,-1)).forEach(c=>o.push(c))});return o}},
  comb:{n:'빗살 미로',f:()=>{const o=[];for(let r=0;r<7;r++){const y=2+r*2;(r%2?rng(2,6):rng(0,4)).forEach(x=>o.push([x,y]))}return o}},
  whsnake:{n:'넓은 가로 뱀',f:()=>hs([2,5,8,11])}}})();
const MZ_TIER={M:['whsnake'],H:['wvsnake','diag','comb'],X:['hsnake','hsnake2','mix','vsnake'],Z:['hsnake','hsnake2','mix','vsnake'],A:['hsnake','hsnake2','mix','vsnake']};
// 완성했을 때의 평균 길 길이(기본 알 타워를 남길 때/철거할 때)를 미리 계산해서, 더 길어지는 쪽을 골라요
function mzLen(cells,keepEgg){const g=Array.from({length:ROWS},()=>Array(COLS).fill(null));let n=0;if(keepEgg){g[8][3]=1;n=1}
 for(const [x,y] of cells){if(n>=BAL.cap)break;if(x<0||x>=COLS||y<1||y>=ROWS-1||g[y][x])continue;g[y][x]=1;if(!allOK(g)){g[y][x]=null;continue}n++}
 let s=0;for(let x=0;x<COLS;x++){const pa=bfs(g,x,0);s+=pa?pa.length:0}return s/COLS}
function mazeOrder(p){if(p.mzo)return p.mzo;const L=MZ_TIER[diff];if(!L)return null;const k=L[Math.floor(Math.random()*L.length)],mr=Math.random()<.5;
 let cells=MZ[k].f();if(mr)cells=cells.map(([x,y])=>[COLS-1-x,y]);
 const a=mzLen(cells,true),b=mzLen(cells,false);p.mzDem=b>a+1;p.mzName=MZ[k].n+(p.mzDem?' (알 타워 철거)':'');return p.mzo=cells}
function buildT(p,g,wall){const b=wall?TB.wall:pickTower(p,g);if(!b||p.gold<tcost(p,b))return false;
 const mo=MZ_TIER[diff]&&mazeOrder(p);if(mo){if(p.mzDem){const e=p.grid[8][3];if(e&&e.bp.id==='egg'){p.gold+=Math.floor(e.inv*refR(p));p.grid[8][3]=null;refreshPaths(p)}}
  const kz=g.fl&&g.fl.kz&&b.r&&(b.slow||b.splash||b.freeze||b.self||b.chain);let mo2=mo;if(kz){const pa=bfs(p.grid,COLS>>1,0)||[],cand=mo.filter(([x,y])=>!p.grid[y][x]).slice(0,6);// 🎯 킬존: 다음 후보 중 길을 가장 많이 덮는 칸부터
   mo2=cand.map(([x,y])=>[x,y,pa.filter(q=>Math.hypot(cellX(q.x,q.y)-cellX(x,y),cellY(q.y)-cellY(y))<=b.r).length]).sort((a,c)=>c[2]-a[2]).concat(mo)}
  for(const [x,y] of mo2){if(p.grid[y][x])continue;p.grid[y][x]=mkR(b,p);if(allOK(p.grid)){p.gold-=tcost(p,b);if(S.st){S.st.ti[b.id]=(S.st.ti[b.id]||0)+tcost(p,b);S.st.tn[b.id]=(S.st.tn[b.id]||0)+1}refreshPaths(p);return true}p.grid[y][x]=null}return false}
 let best=null,bs=-1e9;
 for(let k=0;k<24;k++){const x=Math.floor(Math.random()*COLS),y=1+Math.floor(Math.random()*(ROWS-2));
  if(p.grid[y][x])continue;p.grid[y][x]=1;let s=-1e9;const L=allOK(p.grid);
  if(L){const pa=bfs(p.grid,COLS>>1,0),px=cellX(x,y),py=cellY(y);
   s=L*(b.id==='wall'?3:1.6)-(b.id==='wall'?0:Math.min(...pa.map(q=>Math.hypot(cellX(q.x,q.y)-px,cellY(q.y)-py)))*6)+Math.random();
   if(b.pylon)for(const[dx,dy]of NBR[y&1]){const q=p.grid[y+dy]&&p.grid[y+dy][x+dx];if(q&&q.bp&&q.bp.pylon)s+=9}
   if(g.fl&&g.fl.kz&&b.r&&(b.slow||b.splash||b.freeze||b.self||b.chain))s+=pa.filter(q=>Math.hypot(cellX(q.x,q.y)-px,cellY(q.y)-py)<=b.r).length*1.1}// 🎯 킬존
  p.grid[y][x]=null;if(s>bs){bs=s;best=[x,y]}}
 if(!best||bs<-1e8)return false;
 p.grid[best[1]][best[0]]=mkR(b,p);p.gold-=tcost(p,b);if(S.st){S.st.ti[b.id]=(S.st.ti[b.id]||0)+tcost(p,b);S.st.tn[b.id]=(S.st.tn[b.id]||0)+1}refreshPaths(p);return true}
// 🔍 정찰: 다음 사람 판의 대공 비율·광역 비율·CCTV 유무(2초마다 갱신)
function scoutOf(p,n){const c=p.sc;if(c&&c.n===n&&S.t-c.t<2)return c;let air=0,gr=0,spl=0,all=0,cc=0,go=0,hv=0,dot=0,zp=0;S.pl[n].grid.flat().forEach(t=>{if(!t||!t.bp||!t.bp.d)return;const b=t.bp,d=t.d/b.cd;all+=d;if(b.t!=='G')air+=d;if(b.t!=='A')gr+=d;if(b.t==='G')go+=d;if(b.splash||b.self||b.chain)spl+=d;if(b.cctv)cc++;if(b.cd>=1.5)hv+=d;if(b.poison||b.burn)dot+=d;if(b.zap)zp+=d});
 const r=v=>all?v/all:0;return p.sc={n,t:S.t,air:r(air),spl:r(spl),cc,gonly:r(go),heavy:r(hv),dot:r(dot),zap:r(zp)}}
/* AI 새 고르기 보정: 도도새 과소비(효율 0.04) 줄이기 */const AIPEN={dodo:-2.6,ostrich:-.4,parrot:.9,falcon:.9,seagull:.9,pirate:.7,pigeon:.5,swan:.7};/* +는 개그 능력 새를 AI도 가끔 쓰게 */
function buyU(p,g,dump){const n=nextAlive(p.id);if(n===null)return false;const hs=g.fl&&g.fl.scout,sc=scoutOf(p,n),kq=hs?1:.75;/* 모든 AI가 다음 사람 수비를 살펴봄(지능형은 더 강하게) */
 const cap=p.gold*(dump?1:g.uTier),l=U.filter(u=>ucost(p,u)<=cap&&techOK(p,u)&&!u.hidden&&!u.secret);if(!l.length)return false;
 let b=null,bs=-1e9;/* 🐝 벌새 떼 폭탄: 광역이 아주 세지 않으면 가끔 돈을 모아 한꺼번에 */const HB=UB.humbee;if(HB&&techOK(p,HB)&&sc.spl<.6&&p.gold>=ucost(p,HB)*2&&Math.random()<(sc.heavy>.3?.25:.12)){b=HB;bs=1e9;p.bomb=1}
 for(const u of l){if(bs>=1e9)break;const sc_=(1-g.uHeavy)*u.inc/u.c*40+g.uHeavy*u.hp/u.c*.8+(u.t==='A'?g.uAir:1-g.uAir)*1.2+(u.x?(g.uSpec??.5)*1.4:0)+(u.tech?.6:0)+(u.combo?1.2:0)+(dump?u.c/400:0)+(g.fav&&g.fav[u.id]||0)+(hs?(u.t==='A'?(sc.air<.4?2.2:-.8):0)+((u.count||1)>1&&sc.spl<.3?2:0)+(sc.spl>.5?u.hp/u.c*1.5:0)+(u.stealth&&!sc.cc?2:0):0)/* 지능형만: 원래 정찰 보정 */
  +kq*((u.t==='A'&&(sc.air<.4||sc.gonly>.35)?1.4:0)+(u.shield&&sc.zap<.15&&sc.dot>.3?2.4:0)+(u.swarm&&sc.heavy>.3&&sc.spl<.45?3.4:0))/* 모든 AI: 공중·보호막·벌새 */+(AIPEN[u.id]||0)+Math.random()*.8;if(sc_>bs){bs=sc_;b=u}}
 if(!b)return false;p.gold-=ucost(p,b);if(S.st){S.st.us[b.id]=(S.st.us[b.id]||0)+ucost(p,b);S.st.un[b.id]=(S.st.un[b.id]||0)+1}p.income+=gainInc(p,b);{const cn=cntOf(b);for(let k=0;k<cn;k++)spawn(S.pl[n],b,p.id)}
 /* 🐝 벌새 떼 폭탄: 강타형 위주·광역 약한 상대면 한꺼번에 몰아 보내기 */if(b.swarm&&p.bomb){p.bomb=0;let ex=0;while(ex<2&&p.gold>=ucost(p,b)){ex++;p.gold-=ucost(p,b);if(S.st){S.st.us[b.id]+=ucost(p,b);S.st.un[b.id]++}p.income+=gainInc(p,b);const cn=cntOf(b);for(let k=0;k<cn;k++)spawn(S.pl[n],b,p.id)}if(ex&&n===0&&!S.sim)toast('🐝 벌새 떼 습격! 광역 타워로 막으세요')}
 return true}
function aiUp(p,c){for(const t of p.grid.flat()){if(t&&t.bp.id!=='wall'&&t.lv<c.up&&p.gold>=upc(t,p)){const k=upc(t,p);p.gold-=k;t.lv++;t.d=Math.floor(t.d*1.6);t.r+=.25;t.inv+=k;if(S.st){S.st.ti[t.bp.id]=(S.st.ti[t.bp.id]||0)+k;S.st.up++}return true}}return false}
function aiTick(p){if(p.cfg&&p.cfg.fl&&p.cfg.fl.jug&&jugTick(p))return;if(p.tech2plan&&!p.tech2&&S.t>45&&p.gold>=TECH2C){p.gold-=TECH2C;p.tech2=p.tech2plan;return}
 if(p.tech2&&!p.skU&&S.t>120&&p.gold>=SKC+200&&Math.random()<.5){p.gold-=SKC;p.skU=1;return}
 if(p.skU&&p.skCD<=0&&(p.units.length>=5||(p.life<40&&p.units.length>=2)))useSkill(p);
 const g=p.cfg,t=S.t/60,crisis=p.life<=g.crisis,um={up:Math.round(g.upMax)};
 const tgtT=Math.min(BAL.cap,g.tw0+g.twRate*t+(crisis?5:0)),tgtI=g.inc0+g.incRate*t,nT=cnt(p.grid),need=need8(S.t)*g.def8;
 const act=()=>{
  if(S.t>20&&defPow(p)<need){if(Math.random()<g.upAgg*.6&&aiUp(p,um))return 1;if(nT<BAL.cap&&buildT(p,g,false))return 1}
  if(nT<tgtT&&buildT(p,g,Math.random()<g.wall))return 1;
  if(!crisis&&p.income<tgtI&&Math.random()<g.uShare&&buyU(p,g))return 1;
  if(Math.random()<g.upAgg&&aiUp(p,um))return 1;
  if((S.t>g.rush||p.gold>(g.keep??600))&&buyU(p,g,true))return 1;
  if(nT<BAL.cap&&p.gold>800&&buildT(p,g,false))return 1;
  return 0};
 for(let n=1+Math.min(3,Math.floor(p.gold/1500));n--;)if(!act())break}

// 🔄 재배치 미로(헬 전용): 지상 새가 아래쪽 깊이 들어오면 벽으로 길을 막아 되돌아가게 하고, 5초 뒤 철거해 다시 열어요
function jugTick(p){if(p.jug){if(S.t-p.jug.t>5){const t=p.grid[p.jug.y][p.jug.x];if(t&&t.bp.id==='wall'){p.gold+=Math.floor(t.inv*refR(p));p.grid[p.jug.y][p.jug.x]=null;refreshPaths(p)}p.jug=null;p.jugCD=S.t+6;return true}return false}
 if(S.t<(p.jugCD||0)||p.gold<tcost(p,TB.wall))return false;const G=p.units.filter(u=>u.bp.t==='G'&&!(u.fl>0)&&u.path);if(G.length<4)return false;
 const deep=G.filter(u=>u.y>BH*.5);if(deep.length<3)return false;const cost=()=>G.reduce((a,u)=>{const c=nearCell(u.x,u.y),pa=bfs(p.grid,c.x,c.y);return a+(pa?pa.length:999)},0),base=cost();
 let best=null,bg=0;const lead=deep.sort((a,b)=>b.y-a.y)[0];for(let k=0;k<5&&lead.path&&lead.pi+k+1<lead.path.length;k++){const q=lead.path[lead.pi+k+1];if(!q||p.grid[q.y][q.x]||q.y<1||q.y>ROWS-2)continue;
  p.grid[q.y][q.x]=1;if(allOK(p.grid)){const gn=cost()-base;if(gn>bg){bg=gn;best=q}}p.grid[q.y][q.x]=null}
 if(!best||bg<G.length*2)return false;p.grid[best.y][best.x]=mkR(TB.wall,p);p.gold-=tcost(p,TB.wall);refreshPaths(p);p.jug={x:best.x,y:best.y,t:S.t};return true}

// ---------- 시뮬레이션 ----------
function applyModeBal(k){const m=BAL.mode[k]||BAL.mode.normal;S_MODE=k;
 U.forEach(u=>{if(u.hp0==null){u.hp0=u.hp;u.sh0=u.shield||0}u.hp=Math.round(u.hp0*m.uh);if(u.sh0)u.shield=Math.round(u.sh0*m.uh)});
 T.forEach(b=>{if(b.d0==null){b.d0=b.d;b.cd0=b.cd}b.d=Math.round(b.d0*m.td);b.cd=+(b.cd0*m.as).toFixed(3)})}
let S_MODE='normal';
/* 🎓 알파고가 다른 AI를 가르침: 성격(인컴·새 고르기·속성)은 그대로, 운영(업그레이드·벽·미로·수비·돈 쓰는 때)만 알파고 쪽으로 L만큼 */function aiLearn(g,L,n){/* 자기 성향 알파고에게 배움: 이자형→알파 이자형, 안정형→알파 안정형, 러시·올인→알파 러시, 나머지는 알파고 평균 */const T=/이자형/.test(n||'')?ALPHA_ARCH_SK.inc:/안정형/.test(n||'')?ALPHA_ARCH_SK.def:/러시|올인/.test(n||'')?ALPHA_ARCH_SK.rush:/조련사|공중/.test(n||'')?ALPHA_ARCH_SK.air:ALPHA_SKILL;if(L>0)for(const k in T)if(g[k]!=null)g[k]+=(T[k]-g[k])*L;return g}
function start(gs,p0h){const D=DIFF[diff];const cf=(diff==='A'?AIP.filter(a=>a.alpha):AIP.filter(a=>!a.hell||diff==='X'||diff==='Z')).sort(()=>Math.random()-.5);if(diff==='Z')cf.sort((a,b)=>(b.hell&&!b.alpha?1:0)-(a.hell&&!a.alpha?1:0));/* 알파고=진화 AI만, 헬=지능형 3종 우선 *//* 매 판 성향 무작위(지능형은 어려움·헬에서만, 헬은 지능형 3종이 꼭 나옴) */
 const RK=raceAssign(gs);applyModeBal(RK.some(Boolean)?'race':'normal');EGG.n=0;S={t:0,inc:0,kills:0,dealt:0,off:Math.floor(Math.random()*8),sim:!!gs,p0h:!!p0h,cdn:gs?0:5,lm:1,pl:[]};techPend=null;
 for(let i=0;i<8;i++){const g=Array.from({length:ROWS},()=>Array(COLS).fill(null));g[8][3]=mkR(TB.egg,{race:RK[i]});
  const ai=gs?gs[i]:(i?aiLearn({...mutG(cf[i-1].g,.07),tech:cf[i-1].g.tech,tech2:cf[i-1].g.tech2,fav:cf[i-1].fav,pn:cf[i-1].n,fl:cf[i-1].fl},cf[i-1].alpha?0:D.learn||0,cf[i-1].n):null),tech=ai?TK[Math.min(4,Math.floor(ai.tech??Math.random()*5))]:null;
  let t2=ai?TK[Math.min(4,Math.floor(ai.tech2??Math.random()*5))]:null;if(t2&&t2===tech)t2=TK[(TK.indexOf(tech)+1+Math.floor(Math.random()*4))%5];
  S.pl.push({id:i,name:gs?`G${i}`:(i?`${(i+S.off)%8+1}번 ${RK[i]?RACE[RK[i]].ic:''}${TECH[tech].ic}${TECH[t2].ic}${cf[i-1].n}`:`${S.off+1}번 ${heroTag()}`),tech,tech2:null,tech2plan:t2,race:RK[i],skU:0,skCD:0,boost:0,reveal:0,color:PC[i],gold:(i||(gs&&!p0h))?D.g:500,income:(i||(gs&&!p0h))?D.i:30,ai:!!(i||(gs&&!p0h)),life:100,alive:true,grid:g,units:[],cfg:ai,dealt:0,pi:0,aiT:Math.random()*1.5})}
 sel=null;insp=null;view=0;paused=false;over=false;spd=1;document.querySelector('footer').style.opacity='';$('pz').textContent='⏸';$('sp').textContent='1x';$('end').style.display='none';
 $('title').style.display='none';$('game').style.display='flex';
 if(!R)init3();resize();ui();lanePick=null;try{laneFit()}catch(e){}if(!gs){try{$('t1').onclick&&$('t1').onclick()}catch(e){}S.cdl=6;cdnUI();sfx('start');toast((RK[0]?`${RACE[RK[0]].ic} ${RACE[RK[0]].n} · `:'')+'🔮 카운트다운 동안 타워 탭에서 속성을 골라요')}}
function escape(p,u){const o=S.pl[u.owner];if(u.owner!==p.id){const E=S.escA||(S.escA={}),q=u.owner*8+p.id;E[q]=(E[q]||0)+1}if(u.owner===0&&p.id!==0){S.esc=S.esc||{};S.esc[p.id]=(S.esc[p.id]||0)+1}if(u.owner!==p.id){if(p.id===0)sfx('leak',{dm:u.bp.dm*lateMul()});if(p.id===view)artFx('leak',{u})}
 if(u.owner!==p.id){const dm=u.bp.dm*lateMul();p.life=Math.max(0,p.life-dm);if(S.st){const k=u.src||(u.hatch?'egg_legs':u.bp.id);/* 펠리컨 승객 피해는 펠리컨 몫 */S.st.ue[k]=(S.st.ue[k]||0)+dm}o.dealt+=dm;if(u.owner===0)S.dealt+=dm;{const rm=rOf(o);if(rm&&rm.loot&&o.alive)o.gold+=rm.loot}
  if(u.bp.drain&&o.alive){o.life=Math.min(100,o.life+u.bp.drain);if(u.owner===0)toast('🦇 라이프 강탈 +'+u.bp.drain)}
  if(u.bp.steal&&o.alive){o.income+=u.bp.steal;if(u.owner===0)toast('🏴‍☠️ 인컴 약탈 +'+u.bp.steal)}}
 const n=nextAlive(p.id);if(n!==null&&n!==u.owner)spawn(S.pl[n],u.bp,u.owner,u.hp,{sh:u.sh,rv:u.rv,hatch:u.hatch,hd:u.hd,gold:u.gold,col:u.col,ext:u.ext,wg:u.wg,src:u.src})}
function step(dt){const D=DIFF[diff];S.t+=dt;S.inc+=dt;
 {if(!S.sim&&typeof newsBird==='function'){const pw=[[BAL.late1-30,BAL.lm1],[BAL.late2-30,BAL.lm2]].find(([t])=>S.t>=t&&S.t<t+1&&S.pw!==t);if(pw){S.pw=pw[0];newsBird(`30초 뒤 탈출 피해 ${pw[1]}배!`)}}
  const lm=lateMul();if(lm!==S.lm){S.lm=lm;sfx('alarm',{mul:lm});if(!S.sim){if(typeof newsBird==='function'&&typeof Sc!=='undefined'&&Sc)newsBird(`${Math.floor(S.t/60)}분 돌파! 탈출 피해 ${lm}배!`);else toast(`⏰ ${Math.floor(S.t/60)}분 돌파! 이제 탈출한 새의 피해가 ${lm}배예요`)}}}
 S.pl.forEach(p=>{if(p.skCD>0)p.skCD-=dt;if(p.boost>0)p.boost-=dt;if(p.reveal>0)p.reveal-=dt});
 if(S.t>=300&&!S.snap){S.snap=1;S.pl.forEach(q=>q.inc5=q.income)}
 if(S.inc>=TICK){S.inc-=TICK;S.pl.forEach(p=>{if(p.alive){p.gold+=p.income*(p.ai?(D.im||1):1);}})}
 S.pl.forEach(p=>{if(p.alive&&p.cfg){p.aiT+=dt;if(p.aiT>=D.tick){p.aiT=0;aiTick(p)}}});
 S.pl.forEach(p=>{if(!p.alive)return;const born=[],lay=[];
  const drop=[];p.units=p.units.filter(u=>{const b=u.bp;
   if(u.sh>0&&SHIM.poison&&(u.pois>0||u.ps>0||u.bn>0||u.slow>0)){u.pois=0;u.ps=0;u.pst=0;u.pv=0;u.bn=0;u.slow=0}/* 🛡 보호막 동안 상태이상 씻김 */
   if(u.pois>0){u.pois-=dt;dmgU(u,u.pd*dt)}
   if(u.ps>0){u.ps-=dt;const d=dmgU(u,u.pv*u.pst*dt);if(S.st)S.st.td[u.psrc]=(S.st.td[u.psrc]||0)+d;if(u.ps<=0){u.pst=0;u.pv=0}}
   if(u.bn>0){u.bn-=dt;const d=dmgU(u,u.bv*dt);if(S.st)S.st.td[u.bsrc]=(S.st.td[u.bsrc]||0)+d}
   if(u.amp>0)u.amp-=dt;
   if(u.kbt>0)u.kbt-=dt;
   if(u.bbt>0)u.bbt-=dt;
   if(u.fl>0){u.fl-=dt;if(u.fl<=0){u.fl=0;const d=dmgU(u,u.fpop||0);if(S.st)S.st.td[u.fsrc]=(S.st.td[u.fsrc]||0)+d;if(p.id===view){sfx('pop');artFx('pop',{u})}}}
   if(u.hp<=0){
    if(u.bn>0&&!u.rv){for(const o of p.units)if(o!==u&&o.hp>0&&!im(o,'burn')&&Math.hypot(o.x-u.x,o.y-u.y)<1.3&&(o.bn||0)<1){o.bn=2;o.bv=Math.max(o.bv||0,u.bv*BAL.bsp);o.bsrc=u.bsrc}if(p.id===view)artFx('ignite',{u})}
    if(u.rv){u.rv=0;u.hp=b.hp*.5;u.pois=0;u.ps=0;u.pst=0;u.bn=0;u.stun=0;if(p.id===view){sfx('revive');artFx('revive',{u})}if(p.id===0&&!S.sim)toast('🔥 불사조가 되살아났어요!');return true}
    if(b.extinct&&(u.ext||0)<b.extinct&&Math.random()<.3){u.ext=(u.ext||0)+1;u.hp=b.hp*.3;u.pois=0;u.ps=0;u.pst=0;u.bn=0;u.stun=0;/* 🦤 멸종 거부 */if(p.id===view&&!S.sim){sfx('revive');artFx('revive',{u});popTxt(u,'🦤 멸종 거부!')}return true}
    if(p.id===view&&!S.sim&&b.c>=600)killBanner(b);p.gold+=Math.ceil(b.c/(b.count||1)*BAL.kr);p.kills=(p.kills||0)+1;if(p.id===0)S.kills++;if(u.owner===0&&p.id!==0){S.kl=S.kl||{};S.kl[p.id]=(S.kl[p.id]||0)+1}if(u.owner!==p.id){const K=S.klA||(S.klA={}),q=u.owner*8+p.id;K[q]=(K[q]||0)+1}if(p.id===view){sfx('die',{unit:b.id});artFx('die',{u,col:b.col,air:b.t==='A'})}
    for(let k=0;k<(b.split||0);k++)born.push(u);
    if(b.carry)for(let k=0;k<b.carry;k++)drop.push(u);
    if(b.grab&&u.carry)craneDrop(p,u,false);
    return false}
   if(u.hit>0)u.hit-=dt;
   if(b.id==='egg_legs'&&u.hatch&&!u.hd&&u.y>BH*.45){u.hd=1;const nb=hatchOf(u),r=u.hp/b.hp;u.bp=nb;u.hp=nb.hp*r;u.col=0;if(nb.t==='A')u.path=null;
    if(p.id===view){sfx('hatch',{to:nb.id});artFx('hatch',{u})}}
   if(b.lay){u.lt=(u.lt||0)+dt;if(u.lt>=3){u.lt=0;lay.push(u)}}
   if(b.heal){u.ht=(u.ht||0)+dt;if(u.ht>=1){u.ht=0;p.units.forEach(o=>{if(o!==u&&o.hp>0&&Math.hypot(o.x-u.x,o.y-u.y)<1.8)o.hp=Math.min(o.bp.hp,o.hp+o.bp.hp*.06)})}}
   if(b.peck||b.zap){u.pk-=dt;if(u.pk<=0){const R2=b.peck?1.3:1.8;let near=null,nd=R2;
     for(let y=0;y<ROWS;y++)for(let x=0;x<COLS;x++){const t=p.grid[y][x];if(!t||!t.bp.d)continue;const d=Math.hypot(cellX(x,y)-u.x,cellY(y)-u.y);
      if(d<=R2){if(b.zap)t.dis=2;else if(d<nd){nd=d;near=t}}}
     if(near)near.dis=2;u.pk=b.peck?3:2.5}}
   if(b.sulk||b.poop){/* 🦜 욕쟁이: 근처 타워 1.5초 삐짐 · 🐦 똥 폭격: 아래 타워 3초 느려짐 */const key=b.sulk?'sk':'pp';u[key]=(u[key]??1.2)-dt;if(u[key]<=0){u[key]=b.sulk?2.2:2.5;const R2=b.sulk?1.8:1.2;let nr=null,nd=R2;
     for(let y=0;y<ROWS;y++)for(let x=0;x<COLS;x++){const t=p.grid[y][x];if(!t||!t.bp.d||t.carrier)continue;const d=Math.hypot(cellX(x,y)-u.x,cellY(y)-u.y);if(d<nd){nd=d;nr=t}}
     if(nr){if(b.sulk){nr.dis=Math.max(nr.dis||0,1.5);nr.emo={i:'💢',u:S.t+1.5}}else{nr.poop=S.t+3;if(p.id===view&&!S.sim)artFx('smoke',{x:u.x,y:BH-u.y,r:.35,col:0xffffff})}}}}
   if(b.coffee&&u.sh<b.shield){u.cf=(u.cf??4)-dt;if(u.cf<=0){u.cf=4;u.sh=Math.min(b.shield,(u.sh||0)+b.shield*.25);/* ☕ 커피 한 모금 */if(p.id===view&&!S.sim)popTxt(u,'☕ 후루룩')}}
   if(b.wig&&!u.wg&&u.hp<b.hp*.5){u.wg=1;u.wgfx=1;/* 🦅 가발 날리기: 번쩍이는 머리에 근처 타워 2초 눈부심 */for(let y=0;y<ROWS;y++)for(let x=0;x<COLS;x++){const t=p.grid[y][x];if(t&&t.bp.d&&Math.hypot(cellX(x,y)-u.x,cellY(y)-u.y)<2){t.dis=Math.max(t.dis||0,2);t.emo={i:'😵',u:S.t+2}}}
    if(p.id===view&&!S.sim)popTxt(u,'✨ 번쩍!')}
   if(b.grab){u.gk=(u.gk===undefined?1.5:u.gk)-dt;/* 🏗 철거반장: 멈춰서 집고 → 4초 이고 걷기 → Lv.2 이하는 빈칸으로 옮기기(미로 안 막음), 아니면 제자리 */
    if(u.carry){u.carry.ct-=dt;if(u.carry.ct<=0){craneDrop(p,u,true);u.gk=6}}
    else if(u.gk<=0){let near=null,nd=1.8,nx=0,ny=0;for(let y=0;y<ROWS;y++)for(let x=0;x<COLS;x++){const t=p.grid[y][x];if(!t||!t.bp.d||t.dis>0||t.carrier)continue;const d=Math.hypot(cellX(x,y)-u.x,cellY(y)-u.y);if(d<nd){nd=d;near=t;nx=x;ny=y}}
     if(near){near.carrier=u;near.dis=99;u.carry={t:near,ox:nx,oy:ny,ct:4.6};u.stun=Math.max(u.stun||0,.6);if(p.id===view&&!S.sim){sfx('build');artFx('smoke',{x:cellX(nx,ny),y:BH-cellY(ny),r:.7,col:0xfacc15})}}else u.gk=.4}}
   if(b.fossil&&!u.fz&&u.hp<b.hp*.5){u.fz=1;fossilLand(p,u)}
   if(b.t==='A'&&!(u.gr>0)&&(u.eatN||0)<5&&p.snacks&&p.snacks.length){for(const s of p.snacks)if(!s.e&&Math.hypot(s.x-u.x,s.y-u.y)<.75){s.e=1;u.gr=1;u.eatN=(u.eatN||0)+1;if(p.id===view)sfx('eat');break}}
   if(u.gr>0){u.gr-=dt;if(u.gr<=0){u.gr=0;if(u.eatN<5&&p.snacks){const s=p.snacks.find(s=>!s.e&&Math.hypot(s.x-u.x,s.y-u.y)<1.3);if(s){s.e=1;u.x=s.x;u.y=s.y;u.gr=1;u.eatN++;if(p.id===view)sfx('eat')}}}}
   else if(u.fl>0){}else if(u.stun>0)u.stun-=dt;else{let sp=b.sp*(u.spm||1);if(u.slow>0){u.slow-=dt;sp*=.55}
    if(b.rage&&u.hp<b.hp*.35)sp*=1.6;
    if(b.leap){u.lp=(u.lp??2)-dt;if(u.lp<=0&&u.path&&u.pi<u.path.length-1){u.lp=b.leap;u.jt=.5}}
    if(u.jt>0){u.jt-=dt;sp=Math.max(sp,5);if(u.jt<=0){u.jt=0;/* 🩰 착지: 주변 타워 1초 흔들림 */for(let y=0;y<ROWS;y++)for(let x=0;x<COLS;x++){const t=p.grid[y][x];if(t&&t.bp.d&&Math.hypot(cellX(x,y)-u.x,cellY(y)-u.y)<1.5)t.dis=Math.max(t.dis||0,.6)}if(p.id===view&&!S.sim)PXS.play('impacts/ground-slam',u.x,BH-u.y,0,{fit:2})}}
    if(b.t==='A'||b.over)u.y+=sp*dt*(b.over?BAL.ovs:.9);
    else if(u.path&&u.pi<u.path.length){const n=u.path[u.pi],tx=cellX(n.x,n.y),ty=cellY(n.y),d=Math.hypot(tx-u.x,ty-u.y),s=sp*dt;
     if(d<=s){u.x=tx;u.y=ty;u.pi++}else{u.x+=(tx-u.x)/d*s;u.y+=(ty-u.y)/d*s}}}
   if(u.y>=EY){escape(p,u);return false}return true});
  born.forEach(u=>spawnAt(p,UB.egg_legs,u.owner,undefined,u.x+(Math.random()-.5)*.4,u.y));
  if(drop.length){const PAX=['chick','turkey','rooster','kiwi','goose','duck'];drop.forEach(u=>spawnAt(p,UB[PAX[Math.floor(Math.random()*PAX.length)]],u.owner,undefined,Math.max(.3,Math.min(COLS+.2,u.x+(Math.random()-.5)*1.4)),u.y+(Math.random()-.5)*.8,Object.assign({src:'pelican'},u.tag?{tag:u.tag}:{})));
   if(p.id===view&&!S.sim){toast('🚌 펠리컨 격추! 승객 새들이 우르르 쏟아져요');artFx('hatch',{u:drop[0]})}}
  lay.forEach(u=>{spawnAt(p,UB.egg_legs,u.owner,undefined,u.x,u.y,{hatch:eggHasP(S.pl[u.owner],'hatch')?1:0});if(p.id===view){sfx('lay');artFx('lay',{u})}});
  {const cc=[];p.grid.forEach((row,y)=>row.forEach((t,x)=>{if(t&&t.bp&&t.bp.cctv&&!(t.dis>0))cc.push([cellX(x,y),cellY(y),t.r])}));p.units.forEach(u=>{u.seen=u.bp.stealth&&cc.some(c=>Math.hypot(u.x-c[0],u.y-c[1])<=c[2]);if(u.bp.dodge){u.cam=cc.some(c=>Math.hypot(u.x-c[0],u.y-c[1])<=c[2]);if(u.cam&&!u.fined){u.fined=1;p.gold+=15;/* 📸 과속 단속 */if(p.id===view&&!S.sim)popTxt(u,'📸 과속 단속! +15G')}}})}
  if(p.snacks&&p.snacks.length)p.snacks=p.snacks.filter(s=>!s.e&&(s.life-=dt)>0);
  if(p.clouds&&p.clouds.length){p.clouds=p.clouds.filter(c=>(c.life-=dt)>0);for(const c of p.clouds){c.tk-=dt;if(c.tk>0)continue;c.tk=.5;for(const u of p.units)if(!im(u,'poison')&&Math.hypot(u.x-c.x,u.y-c.y)<=c.r)addPois(u,c.pv,c.src)}}
  p.pyT=(p.pyT||0)+dt;if(p.pyT>=.25){const dtp=p.pyT;p.pyT=0;const W=pyWires(p);let zapped=0,mx=1;
   p.grid.forEach(r=>r.forEach(t=>{if(t&&t.bp&&t.bp.pylon&&t.dis>0)t.dis-=dtp}));
   const hid=u=>u.bp.stealth&&u.y<BH*u.bp.stealth&&!(p.reveal>0)&&!u.seen,air=u=>(u.bp.t==='A'||u.fl>0)&&!(u.gr>0),PY=BAL.py;
   for(const w of W){if(w.a.dis>0||w.b.dis>0)continue;const dps=(w.a.d+w.b.d)/2*w.m;
    for(const u of p.units){if(hid(u))continue;const d=segD(u.x,u.y,w),A=air(u);if(d<(A?PY.ar:PY.gr)){const ef=dmgU(u,dps*(A?PY.am:PY.gm)*dtp,1);if(S.st)S.st.td.pylon=(S.st.td.pylon||0)+ef;zapped++;mx=Math.max(mx,w.m)}}}
   // 이웃 없는 외톨이 전봇대: 약한 방전
   p.grid.forEach((row,y)=>row.forEach((t,x)=>{if(!t||!t.bp||!t.bp.pylon||t.dis>0)return;if(W.some(w=>w.a===t||w.b===t))return;const cx=cellX(x,y),cy=cellY(y);
    for(const u of p.units){if(hid(u))continue;const A=air(u);if(Math.hypot(u.x-cx,u.y-cy)<PY.lr){const ef=dmgU(u,t.d*(A?PY.la:PY.lg)*dtp,1);if(S.st)S.st.td.pylon=(S.st.td.pylon||0)+ef;zapped++}}}));
   if(zapped&&p.id===view){sfx('wire',{mult:mx});artFx('wire',{n:zapped,mult:mx})}}
  for(let y=0;y<ROWS;y++)for(let x=0;x<COLS;x++){const t=p.grid[y][x];if(!t)continue;
   if(t.bp.snack){if(t.dis>0){t.dis-=dt;continue}t.cd-=dt;if(t.cd>0)continue;t.cd=t.bp.cd*(p.boost>0?.5:1);const cx=cellX(x,y),cy=cellY(y);p.snacks=p.snacks||[];
    const air=p.units.filter(u=>u.bp.t==='A'&&!(u.gr>0)&&u.y<cy+t.r&&Math.abs(u.x-cx)<t.r).sort((a,b)=>b.y-a.y);
    for(let k=0;k<t.bp.snack+(t.lv-1);k++){const u=air[k];let sx,sy;if(u){sx=u.x+(Math.random()-.5)*.3;sy=Math.max(u.y+.7,cy-.5+k*.55+Math.random()*.3)}else{const a=Math.random()*6.283,r=Math.random()*t.r*.6;sx=cx+Math.cos(a)*r;sy=cy+Math.sin(a)*r}
     if(p.snacks.length>=15)p.snacks.shift();p.snacks.push({x:Math.max(.2,Math.min(COLS+.3,sx)),y:Math.max(cellY(1),Math.min(cellY(ROWS-2),sy)),life:8})}
    if(p.id===view){t.kick=1;sfx('shoot',{tower:'snack'});artFx('shoot',{tower:'snack',x:cx,y:BH-cy,tx:cx,ty:BH-cy,air:false,col:t.bp.col,b:t.bp})}continue}
   if(!t.bp.d||t.bp.pylon)continue;
   if(t.dis>0){t.dis-=dt;continue}
   if(t.cd>0){t.cd-=dt;continue}
   const b=t.bp,cx=cellX(x,y),cy=cellY(y),vis=o=>(!b.t||b.t===(o.gr>0?'G':o.fl>0?'A':o.bp.t))&&(p.reveal>0||o.seen||!(o.bp.stealth&&o.y<BH*o.bp.stealth));
   let tg=null,my=-1;for(const u of p.units){if(vis(u)&&Math.hypot(u.x-cx,u.y-cy)<=t.r&&u.y>my){my=u.y;tg=u}}
   if(!tg){if(t.heat)t.heat=Math.max(0,t.heat-dt*.6);continue}
   let crit=1;if(b.rapid)t.heat=Math.min(1,(t.heat||0)+BAL.rh);if(b.heavy){t.hc=(t.hc||0)+1;if(t.hc%3===0)crit=BAL.hcr}
   t.cd=b.cd*(p.boost>0?.5:1)/(b.rapid?1+BAL.rs*t.heat:1)*(t.poop>S.t?1.6:1);
   if(b.trap){// 🪴 파리지옥: 머리 수(Lv1~3, 최대 3)만큼 지상 새를 물어 묶고 독. 덩치 큰 새(체력 2000+)는 절반만. Lv.4는 체력 12% 이하면 꿀꺽
    const heads=Math.min(3,t.lv),hold=t.lv>=3?1.8:1.6,lvm=1+(t.lv-1)*.5,C=p.units.filter(u=>vis(u)&&!(u.held>S.t)&&Math.hypot(u.x-cx,u.y-cy)<=t.r).sort((a,c)=>c.y-a.y).slice(0,heads);
    if(!C.length){t.cd=.2;continue}
    for(const u of C){const big=u.bp.hp>=2000,h=hold*(big?.5:1);let ef;
     if(t.lv>=4&&u.hp<=u.bp.hp*.12){ef=dmgU(u,u.hp+1);if(p.id===view&&!S.sim)artFx('gulp',{u})}
     else{ef=dmgU(u,t.d);u.stun=Math.max(u.stun||0,h);u.held=S.t+h;if(!im(u,'poison'))addPois(u,b.poison*BAL.pk*lvm,b.id);if(p.id===view&&!S.sim){artFx('vine',{x:cx,y:BH-cy,tx:u.x,ty:BH-u.y,life:h});if(typeof PFX!=='undefined')PFX.play('chomp',u.x,BH-u.y,.05,0,1,h)}}
     if(S.st)S.st.td[b.id]=(S.st.td[b.id]||0)+(ef||0);if(p.id===view&&!S.sim)dmgPop(u,ef||0,false)}
    if(p.id===view){t.kick=1;sfx('shoot',{tower:'acid'})}continue}
   let hits=b.self?p.units.filter(o=>vis(o)&&Math.hypot(o.x-cx,o.y-cy)<=t.r):b.splash?p.units.filter(o=>vis(o)&&Math.hypot(o.x-tg.x,o.y-tg.y)<=b.splash):[tg];
   if(b.chain){const set=[tg];let cur=tg;for(let k=1;k<b.chain;k++){let nb=null,nd=1.8;for(const o of p.units){if(set.includes(o)||!vis(o))continue;const d=Math.hypot(o.x-cur.x,o.y-cur.y);if(d<nd){nd=d;nb=o}}
     if(!nb)break;if(p.id===view)beamU(cur,nb,b.col);set.push(nb);cur=nb}hits=set}
   if(p.id===view){t.kick=1;sfx('shoot',{tower:b.id});artFx('shoot',{tower:b.id,x:cx,y:BH-cy,tx:tg.x,ty:BH-tg.y,air:tg.bp.t==='A',col:b.col,b})}
   const lvm=1+(t.lv-1)*.5;if(crit>1&&p.id===view)artFx('crit',{u:tg});
   if(b.poison&&(b.splash||b.self)){p.clouds=p.clouds||[];if(p.clouds.length>=14)p.clouds.shift();const cx2=b.self?cx:tg.x,cy2=b.self?cy:tg.y,cr=b.self?Math.min(t.r,2.2):b.splash;p.clouds.push({x:cx2,y:cy2,r:cr,life:BAL.cl,tk:.5,pv:b.poison*BAL.pk*lvm,src:b.id});if(p.id===view&&!S.sim)PXS.play('nature/toxic-gas',cx2,BH-cy2,0,{loop:true,life:BAL.cl,fit:cr*1.35,op:.5});if(p.id===view)artFx('smoke',{x:cx2,y:BH-cy2,r:cr,col:b.col})}
   hits.forEach((h,i)=>{if(h.bp.dodge&&!h.cam&&Math.random()<h.bp.dodge){if(p.id===view&&!S.sim)popTxt(h,'MISS!');return}/* 🦅 과속 매 회피 */const dd=(t.d*(b.chain&&i?.75:1)*(h===tg?crit:1)+(b.heavy&&h===tg?h.bp.hp*BAL.hmx:0))*(h.bp.swarm&&b.heavy?.5:1);const ef=dmgU(h,dd,b.zap);if(S.st)S.st.td[b.id]=(S.st.td[b.id]||0)+ef;if(p.id===view&&!S.sim)dmgPop(h,ef,h===tg&&crit>1);
    if(b.poison&&!im(h,'poison'))addPois(h,b.poison*BAL.pk*lvm,b.id);
    if(b.burn&&!im(h,'burn')){h.bn=BAL.bdur;const bv=b.burn*BAL.bk*lvm;if(bv>=(h.bv||0)){h.bv=bv;h.bsrc=b.id}}
    if(b.slow&&!im(h,'slow'))h.slow=Math.max(h.slow,2.2);
    if(b.amp)h.amp=4;
    if(b.kb)kbU(h,1)});
   if(b.stun&&!im(tg,'stun'))tg.stun=Math.max(tg.stun,b.stun);
   if(b.bubble&&!im(tg,'kb')&&!(tg.fl>0)&&!(tg.bbt>0)&&tg.hp>0){tg.fl=b.bubble;tg.bbt=b.bubble+2;tg.fpop=t.d*2*crit;tg.fsrc=b.id}
   if(b.freeze&&!im(tg,'stun')&&!im(tg,'slow')&&Math.random()<b.freeze){tg.stun=Math.max(tg.stun,1.2);if(p.id===view&&!S.sim&&S.t-(S.pxIce||-9)>.15){S.pxIce=S.t;PXS.play('ice/ice-shatter',tg.x,BH-tg.y,tg.bp.t==='A'?1:0,{sc:.75,delay:.9})}}}});
 S.pl.forEach(p=>{if(p.alive&&p.life<=0){p.alive=false;p.dieT=S.t;if(p.id!==0)sfx('elim',{id:p.id});if(p.id!==0&&!S.sim&&typeof NEWS!=='undefined'&&!NEWS){const k=S.pl.filter(q=>q.alive).length;if(k>=2)try{newsBird(`📢 속보! ${(p.id+S.off)%8+1}번 진영 탈락 · 남은 ${k}명`)}catch(e){}}const n=nextAlive(p.id);
  if(n!==null)p.units.forEach(u=>spawn(S.pl[n],u.bp,u.owner,u.hp,{sh:u.sh,rv:u.rv,hatch:u.hatch,hd:u.hd,gold:u.gold,col:u.col,ext:u.ext,wg:u.wg,src:u.src}));
  p.units=[];p.grid=Array.from({length:ROWS},()=>Array(COLS).fill(null))}});
 const al=S.pl.filter(p=>p.alive);if(S.spec&&!S.pl[view].alive&&al.length){const n=nextAlive(view);if(n!==null){view=n;sel=null;insp=null}}
 if(S.net==='host'&&!S.spec&&!S.pl[0].alive&&al.length>1){S.spec=1;$('spx').style.display='';document.querySelector('footer').style.opacity=.4;view=al[0].id;toast('💀 탈락! 방장은 끝까지 게임을 이어서 돌려요 · 관전 중')}
 if(S.sim){if(al.length<=1)finish(false)}else if(S.spec){if(al.length<=1)specEnd(al[0])}else if(!S.pl[0].alive)finish(false);else if(al.length===1)finish(true)
 if(over&&S.net==='host'&&typeof NET!=='undefined')NET.over(al[0]?al[0].id:-1)}
// 🏁 게임 결과 표: 등수(살아남은 순 → 늦게 탈락한 순), 인컴, 상대에게 준 라이프 피해, 막은 새, 버틴 시간
function resultUI(){const e=$('eres');if(!e||!S||S.sim)return;const L=S.pl.slice().sort((a,b)=>(b.alive-a.alive)||(b.alive?b.life-a.life:(b.dieT||0)-(a.dieT||0)));
 const md=['🥇','🥈','🥉'],nm=p=>p.name.replace(/^(\d+번) /,'$1 ');let h='<table><tr><th>등수</th><th>진영</th><th>인컴</th><th>준 피해</th><th>막은 새</th><th>버틴 시간</th></tr>';
 L.forEach((p,i)=>{const n=document.createElement('span');n.textContent=nm(p);h+=`<tr class="${p.id===0?'me':''}${p.alive?' win':''}"><td>${md[i]||i+1}</td><td class="nm">${n.innerHTML}</td><td>+${p.income}</td><td>${Math.round(p.dealt||0)}</td><td>${p.kills||0}</td><td>${p.alive?'끝까지':fmt(p.dieT||S.t)}</td></tr>`});
 e.innerHTML=h+'</table>'}
function finish(win){over=true;sfx(win?'win':'lose');sfx('bgm_stop');$('eT').textContent=win?'🏆':'💀';$('eH').textContent=win?'최종 우승!':'탈락…';
 $('eP').textContent=`생존 시간 ${fmt(S.t)} · 처치 ${S.kills} · 가한 피해 ${S.dealt}`;try{rewardUI(win)}catch(e){}try{resultUI()}catch(e){}try{aiEnd(win)}catch(e){}
 $('spec').style.display=!win&&!S.sim&&S.pl.filter(p=>p.alive).length>=2?'block':'none';$('end').style.display='flex'}
// 👀 탈락 후 관전: AI끼리 끝날 때까지 이어서 보기
function specGo(){if(!S)return;S.spec=1;over=false;$('end').style.display='none';$('spx').style.display='';document.querySelector('footer').style.opacity=.4;const i=S.pl.findIndex(p=>p.alive);if(i>=0)view=i;sel=null;insp=null;sfx('bgm_start');toast('👀 관전 중 · 미니맵을 눌러 다른 진영을 볼 수 있어요');ui()}
function specEnd(w){over=true;sfx('bgm_stop');sfx('win');$('spx').style.display='none';$('eT').textContent='👀';$('eH').textContent=w?`${w.name} 우승!`:'관전 종료';
 $('eP').textContent=`게임 시간 ${fmt(S.t)} · 내 생존 ${fmt(S.pl[0].dieT||S.t)} · 처치 ${S.kills}`;$('ew').innerHTML='';try{resultUI()}catch(e){}try{aiEnd(null)}catch(e){}$('spec').style.display='none';$('end').style.display='flex'}
const fmt=t=>String(Math.floor(t/60)).padStart(2,'0')+':'+String(Math.floor(t%60)).padStart(2,'0');

// ---------- 3D ----------
let XK=1,R,Sc,Cam,tm=new Map(),um=new Map(),fx=[];const ray=new THREE.Raycaster(),pln=new THREE.Plane(new THREE.Vector3(0,0,1),0);
const M=(g,c,o)=>new THREE.Mesh(g,new THREE.MeshStandardMaterial(Object.assign({color:c,roughness:.6},o)));
function init3(){const el=$('cv');Sc=new THREE.Scene();Sc.background=new THREE.Color(0x060b18);
 Cam=new THREE.PerspectiveCamera(42,1,.1,200);R=new THREE.WebGLRenderer({antialias:true});R.setPixelRatio(Math.min(devicePixelRatio,1.75));el.append(R.domElement);R.domElement.addEventListener('webglcontextlost',e=>e.preventDefault());
 Sc.add(new THREE.AmbientLight(0xffffff,.85));const dl=new THREE.DirectionalLight(0xffffff,.9);dl.position.set(8,-8,24);Sc.add(dl);
 const hx=new THREE.CylinderGeometry(.55,.55,.05,6);
 for(let r=0;r<ROWS;r++)for(let c=0;c<COLS;c++){const col=r===0?0x14532d:r===ROWS-1?0x7f1d1d:(r+c)%2?0x133928:0x0f291e;
  const t=M(hx,col);t.rotation.x=Math.PI/2;t.position.set(cellX(c,r),BH-cellY(r),0);t.userData.tile=[c,r];Sc.add(t)}
 artFx('init',{scene:Sc,renderer:R,camera:Cam})}
function resize(){if(!R)return;const el=$('cv'),w=el.clientWidth,h=el.clientHeight;if(!w||!h)return;
 R.setSize(w,h);const a=w/h,sd=108/w,t=.7678,vh=BH+.9;Cam.aspect=a;
 XK=Math.max(1,Math.min(1.5,.98*(1-sd)*vh*a/(COLS+.6)));
 const z=Math.max(vh/t,(COLS+.6)*XK/(.98*(1-sd)*t*a)),cx=(COLS+.6)/2*XK+54/w*t*z*a;
 Sc.scale.x=XK;Cam.position.set(cx,BH/2-2.9,z);Cam.lookAt(cx,BH/2-.4,0);Cam.updateProjectionMatrix()}
addEventListener('resize',resize);new ResizeObserver(resize).observe($('cv'));
function towerMesh(b){const g=new THREE.Group();
 if(b.id==='wall'){const m=M(new THREE.TorusGeometry(.33,.12,6,12),0x78350f);m.position.z=.15;g.add(m)}
 else{const s=M(new THREE.CylinderGeometry(.13,.17,.5,8),0x713f12);s.rotation.x=Math.PI/2;s.position.z=.25;g.add(s);
  const o=M(new THREE.SphereGeometry(.22,10,8),b.col,{emissive:b.col,emissiveIntensity:.35});o.position.z=.65;g.add(o)}
 return g}
function birdMesh(b,oc){const g=new THREE.Group(),air=b.t==='A';
 const body=M(new THREE.SphereGeometry(.24,10,8),b.col);body.scale.set(1,1.2,.9);g.add(body);
 const bk=M(new THREE.ConeGeometry(.07,.2,5),0xf59e0b);bk.rotation.z=Math.PI;bk.position.set(0,-.3,0);g.add(bk);
 [-1,1].forEach(s=>{const w=M(new THREE.BoxGeometry(air?.4:.16,.22,.04),oc);w.position.set(s*(air?.36:.26),0,.02);g.add(w)});
 const bg=new THREE.Mesh(new THREE.PlaneGeometry(.6,.09),new THREE.MeshBasicMaterial({color:0}));bg.position.set(0,.45,.6);
 const f=new THREE.Mesh(new THREE.PlaneGeometry(.56,.06),new THREE.MeshBasicMaterial({color:0x22c55e}));f.position.set(0,.45,.61);f.name='f';g.add(bg,f);
 g.scale.setScalar(b.id==='crocbird'?1.2:.7+Math.min(.9,b.hp/3500));return g}
const GCa={},GC=(k,f)=>{let g=GCa[k];if(!g){g=GCa[k]=f();g.userData.cached=1}return g};const PI=Math.PI,SP=(r,c,o)=>M(GC("s"+r,()=>new THREE.SphereGeometry(r,22,16)),c,o),KO=(r,h,c,o)=>M(GC("k"+r+","+h,()=>new THREE.ConeGeometry(r,h,16)),c,o),BX=(w,d,h,c,o)=>M(GC("b"+w+","+d+","+h,()=>new THREE.BoxGeometry(w,d,h)),c,o),TR=(R,r,c,o)=>M(GC("t"+R+","+r,()=>new THREE.TorusGeometry(R,r,12,28)),c,o),CY=(a,d,h,c,o)=>{const m=M(GC("c"+a+","+d+","+h,()=>new THREE.CylinderGeometry(a,d,h,18)),c,o);m.rotation.x=PI/2;return m},GL=c=>({emissive:c,emissiveIntensity:.7}),TP={transparent:true,opacity:.75};
function towerMesh2(b){const g=new THREE.Group(),sp=[],id=b.id,cl=b.col,wd=0x713f12;g.userData.sp=sp;
 const at=(m,x,y,z,p)=>{m.position.set(x,y,z);(p||g).add(m);return m},rot=(z,v)=>{const q=new THREE.Group();q.position.z=z;q.userData.v=v;sp.push(q);g.add(q);return q};
 if(id==='wall'){at(TR(.34,.1,0x78350f),0,0,.1);for(let i=0;i<6;i++){const t=BX(.62,.05,.05,0x92400e);t.rotation.z=i*PI/6;at(t,0,0,.08+i%3*.04)}[[.1,.05],[-.1,.08],[0,-.1]].forEach(e=>{const s=SP(.09,0xfef3c7);s.scale.z=1.2;at(s,e[0],e[1],.2)});return g}
 at(CY(.4,.44,.1,0x475569),0,0,.05);
 if(id==='egg'){at(CY(.07,.1,.5,wd),0,0,.35);[-1,1].forEach(s=>{const f=BX(.07,.07,.42,wd);f.rotation.y=s*.4;at(f,s*.15,0,.72)});at(BX(.38,.03,.03,cl),0,0,.88);at(SP(.1,0xffffff),0,.06,.88)}
 else if(id==='air'){at(CY(.06,.11,.9,0x334155),0,0,.5);for(let i=0;i<5;i++){const f=SP(.08,cl,{roughness:.3});f.scale.set(.5,.18,2.6);f.rotation.y=(i-2)*.32;at(f,(i-2)*.11,0,1.15)}at(SP(.07,0xe0f2fe,GL(cl)),0,0,1)}
 else if(id==='acorn'){[-1,1].forEach(s=>{const w=TR(.15,.05,0x422006);w.rotation.y=PI/2;at(w,s*.27,0,.18)});at(BX(.22,.62,.22,0x57534e),0,-.12,.42).rotation.x=-.6;at(SP(.14,0xb45309),0,-.38,.66);at(SP(.15,0x78350f),0,-.38,.74).scale.z=.55}
 else if(id==='ice'){at(KO(.15,.8,0x93c5fd,GL(0x60a5fa)),0,0,.65).rotation.x=PI/2;[[.2,.1],[-.2,.1],[0,.22],[.1,-.2],[-.12,-.2]].forEach((e,i)=>{const k=KO(.08,.35+i%2*.15,0xbfdbfe,GL(0x3b82f6));k.rotation.x=PI/2;at(k,e[0],e[1],.3+i%2*.05)});at(TR(.4,.03,cl,GL(cl)),0,0,.14);const r=rot(1.1,1.4);[0,1,2].forEach(i=>{const s=BX(.5,.04,.03,0xe0e7ff,GL(0x93c5fd));s.rotation.z=i*PI/3;at(s,0,0,0,r)})}
 else if(id==='bat'){const d=SP(.4,0x2e1065);d.scale.z=.8;at(d,0,0,.12);[-1,1].forEach(s=>{at(SP(.045,0xff2222,GL(0xff0000)),s*.1,-.3,.3);const w=BX(.4,.04,.22,0x831843);w.rotation.y=s*.5;at(w,s*.4,0,.55);const e=KO(.05,.18,0x4c0519);e.rotation.x=PI/2;at(e,s*.12,0,.85)})}
 else if(id==='flu'){[0,1,2].forEach(i=>at(BX(.05,.05,.3,wd),Math.cos(i*2.1)*.2,Math.sin(i*2.1)*.2,.2));const gm=Object.assign({transparent:true,opacity:.85},GL(0x15803d));at(SP(.3,0x22c55e,gm),0,0,.55);at(CY(.1,.12,.3,0x22c55e,gm),0,0,.88);at(CY(.12,.09,.1,0xa16207),0,0,1.05);const r=rot(.6,1.8);[[.34,0,0],[-.25,.2,.1],[-.1,-.3,-.05]].forEach(e=>at(SP(.05,0xbbf7d0,GL(0x4ade80)),e[0],e[1],e[2],r))}
 else if(id==='thunder'){const cu=0xea8a2b,mt={metalness:.8,roughness:.3};at(CY(.2,.27,.3,0x854d0e),0,0,.25);at(CY(.06,.06,.95,0x78350f),0,0,.65);for(let i=0;i<6;i++)at(TR(.24-i*.025,.04,cu,mt),0,0,.45+i*.1);at(SP(.19,0xfde047,GL(0xfacc15)),0,0,1.2);
  [[1,1],[1,-1],[-1,1],[-1,-1]].forEach(e=>{at(CY(.025,.025,.6,0x9ca3af,mt),e[0]*.32,e[1]*.32,.4);at(SP(.055,0xfef08a,GL(0xfacc15)),e[0]*.32,e[1]*.32,.72)});
  let r=rot(.95,2.6);at(TR(.4,.03,0xfacc15,GL(0xfacc15)),0,0,0,r);[0,1,2,3].forEach(i=>at(SP(.06,0xffffff,GL(0xfde047)),Math.cos(i*PI/2)*.4,Math.sin(i*PI/2)*.4,0,r));
  r=rot(1.5,-1.6);[[.06,.2],[-.06,0],[.06,-.2]].forEach((e,i)=>{const s=BX(.07,.05,.24,0xfde047,GL(0xfacc15));s.rotation.y=i%2?.6:-.6;at(s,e[0],0,e[1],r)})}
 else if(id==='wind'){at(CY(.03,.03,.7,0xf472b6),0,0,.38);at(TR(.16,.03,0xf472b6),0,0,.82).rotation.x=PI/2;
  const r=rot(.9,1.2);[[.35,0,.18],[-.3,.15,.13],[0,-.32,.1]].forEach(e=>at(SP(e[2],0xbae6fd,{transparent:true,opacity:.45}),e[0],e[1],0,r))}
 return g}
// 🐦 새별 몸통 비율 [폭 x, 길이 y, 높이 z] (기본 1·1.25·.95). 맹금·바닷새는 길쭉, 비둘기·올빼미는 통통, 박쥐는 작고 동글
const BODYS={archaeo:[.9,1.62,.86],archaeo_g:[.95,1.5,.9],eagle:[.86,1.62,.84],stormeagle:[.88,1.62,.86],falcon:[.76,1.68,.74],berserk:[1.26,1.36,1.12],pigeon:[1.2,1.12,1.14],crow:[.9,1.48,.86],ghostcrow:[.9,1.48,.86],bonecrow:[.86,1.5,.82],plague:[.94,1.42,.9],
 seagull:[.9,1.52,.84],blizgull:[.94,1.5,.88],albatross:[.82,1.64,.78],pirate:[1.04,1.4,.96],owl:[1.22,.96,1.22],shadowowl:[1.2,.96,1.2],lich:[1.16,.98,1.22],auroraowl:[1.2,.96,1.2],
 parrot:[.92,1.2,1.1],vampire:[.84,.9,.9],voltbat:[.86,.92,.92],phoenix:[.86,1.56,.88],plasmabird:[.86,1.56,.88],comet:[.8,1.64,.8],thunderbird:[.84,1.42,.8],pelican:[1.12,1.45,1.02],
 duck:[1.12,1.45,.86],goose:[1,1.42,1.02],turkey:[1.02,1.18,1],rooster:[1,1.18,1.14],dodo:[1.28,1.22,1.18],woodpecker:[.86,1.18,1.08],kiwi:[1.06,1.22,.98],peacock:[.96,1.3,.98]};
const PENG={penguin:1,frostpeng:1},CHICKY={chick:1,hatch_chick:1,hatch_fire:1,hatch_ice:1,hatch_thunder:1,hatch_wind:1,hatch_dark:1,hatch_gold:1};
const LIFT={crocbird:.26,knight:.3,egg_legs:.2,crane:.25,demcrane:.25};
const HEADX={thunderbird:{hz:.52,hy:-.3,hr:.2},demcrane:{hz:.98,hy:-.3,hr:.13},archaeo_g:{hz:.6,hy:-.34,hr:.14},dodo:{hz:.74,hy:-.36,hr:.15},crocbird:{hz:.68,hy:-.2,hr:.12},hatch_chick:{hz:.56,hy:-.15,hr:.18},hatch_fire:{hz:.56,hy:-.15,hr:.18},hatch_ice:{hz:.56,hy:-.15,hr:.18},hatch_thunder:{hz:.56,hy:-.15,hr:.18},hatch_wind:{hz:.56,hy:-.15,hr:.18},hatch_dark:{hz:.56,hy:-.15,hr:.18},hatch_gold:{hz:.56,hy:-.15,hr:.18},frostpeng:{hz:.74,hy:-.08,hr:.15},auroraowl:{hz:.46,hy:-.3,hr:.2},crane:{hz:.98,hy:-.3,hr:.13},chick:{hz:.56,hy:-.15,hr:.18},penguin:{hz:.74,hy:-.08,hr:.15},swan:{hz:.86,hy:-.3,hr:.13},goose:{hz:.66,hy:-.36,hr:.14}};
// 긴 목: [시작, 조절점, 끝(y,z)], 굵기 시작→끝, 색(없으면 몸 색)
const NECK={demcrane:[[-.2,.64],[-.08,.84],[-.27,.9],.06,.05,0xf1f5f9],archaeo_g:[[-.18,.4],[-.3,.5],[-.33,.56],.07,.06],dodo:[[-.16,.42],[-.34,.5],[-.34,.68],.125,.085,0x7385a8],crane:[[-.2,.64],[-.08,.84],[-.27,.9],.06,.05,0x1f2937],swan:[[-.2,.4],[-.04,.62],[-.27,.78],.07,.055],goose:[[-.22,.36],[-.3,.5],[-.35,.56],.07,.06],ostrich:[[-.18,.78],[-.08,1.06],[-.27,1.2],.07,.045,0xf5b8c8]};
// 나는 새 날개 색(없으면 몸 색을 살짝 어둡게)
const WINGC={demcrane:0x1f2937,archaeo:0x8f8676,pelican:0xf1f5f9,humbee:0xca8a04,crocbird:0x64748b,pirate:0x4a3a2e,knight:0x1f2937,crane:0x1f2937,plague:0x3f5a1f,ghostcrow:0x64748b,voltbat:0x3f3f46,auroraowl:0x7aa2d6,plasmabird:0xf97316,stormeagle:0x4338ca,comet:0xbe123c,blizgull:0xe2e8f0,seagull:0x94a3b8,albatross:0xf1f5f9,eagle:0x5b4030,falcon:0x57534e,owl:0x6d4c33,crow:0x2e2a40,parrot:0x2e7d32,pigeon:0x7c8aa0,swan:0xffffff,phoenix:0xf97316,vampire:0x450a0a,thunderbird:0x3730a3};
const ltn3=c=>{const m=v=>Math.round(v+(255-v)*.3);return(m((c>>16)&255)<<16)|(m((c>>8)&255)<<8)|m(c&255)},dkn3=(c,f)=>((Math.round(((c>>16)&255)*f)<<16)|(Math.round(((c>>8)&255)*f)<<8)|Math.round((c&255)*f));
function birdMesh2(b,oc){const g=new THREE.Group(),id=b.id,A=b.t==='A',c=b.col,w=[],tall=id==='ostrich',LF=LIFT[id]||0,z0=tall?.6:.26+LF;g.userData.w=w;
 const at=(m,x,y,z,s)=>{m.position.set(x,y,z);if(s)m.scale.set(s[0],s[1],s[2]);g.add(m);return m};
 if(PENG[id])at(SP(.26,c),0,0,.34,[.95,.85,1.25]);else if(CHICKY[id])at(SP(.26,c),0,.02,.3,[1,1,1.05]);else if(tall)at(SP(.26,c),0,0,z0,[1.15,1.3,.95]);else if(id==='crocbird')at(SP(.26,c),0,.02,z0+.02,[.68,.85,.68]);else at(SP(.26,c),0,0,z0,BODYS[id]||[1,1.25,.95]);
 const hx=HEADX[id],hc={eagle:0xf8fafc,turkey:0x8b5a3c,phoenix:0xfde047,duck:0x166534,pigeon:0x64748b,dodo:0x7385a8,woodpecker:0xf8fafc,ostrich:0xf5b8c8,humbee:0x16a34a,pelican:0xf8fafc,crocbird:0x9ca3af}[id]||c,hz=hx?hx.hz:tall?1.3:z0+.2,hy=hx?hx.hy:tall?-.28:-.3,hr=hx?hx.hr:id==='owl'?.2:id==='chick'?.17:.15;
 if(id==='egg_legs'){[-1,1].forEach(s=>at(SP(.035,0x111111),s*.08,-.2,z0+.14));const k=KO(.05,.12,0xf59e0b);k.rotation.z=PI;at(k,0,-.3,z0+.08)}
 else{const nk=NECK[id];if(nk){const[a,m,e,r0,r1,nc]=nk,n=tall?18:12;for(let i=0;i<n;i++){const t=i/(n-1),q=1-t;at(SP(r0+(r1-r0)*t,nc||c),0,q*q*a[0]+2*q*t*m[0]+t*t*e[0],q*q*a[1]+2*q*t*m[1]+t*t*e[1])}}
  at(SP(hr,hc),0,hy,hz);const ec=id==='owl'?0xfde047:id==='vampire'?0xff2020:0x111111;
  {const ek=id==='owl'?1:hr/.15;/* 머리가 크면 눈 위치·크기도 같이 */[-1,1].forEach(s=>at(SP((id==='owl'?.065:.035)*Math.sqrt(ek),ec,id==='vampire'?GL(0xff0000):{}),s*.08*ek,hy-.09*ek,hz+.06*ek))}
  const bk={kiwi:[.025,.42,0xd97706],duck:[.08,.2,0xfacc15],dodo:[.004,.02,0xf4a259],swan:[.045,.14,0xf97316],penguin:[.035,.13,0x1f2937],frostpeng:[.035,.13,0x312e81],crane:[.035,.28,0xd6d3a0],blizgull:[.04,.22,0xf97316],stormeagle:[.07,.22,0xfacc15],comet:[.05,.14,0xfacc15],eagle:[.07,.22,0xfacc15],parrot:[.004,.02,0xf59e0b],owl:[.04,.1,0xca8a04],ostrich:[.06,.17,0xe0a088],knight:[.04,.34,0xef4444],humbee:[.016,.3,0x111827],pelican:[.07,.5,0xf59e0b],crocbird:[.035,.15,0x1f2937],woodpecker:[.035,.3,0x57534e],turkey:[.05,.14,0xf59e0b]}[id]||[.055,.16,0xf59e0b];
  const k=KO(bk[0],bk[1],bk[2]);k.rotation.z=PI;at(k,0,hy-hr-bk[1]/2+.04,hz-.03,id==='duck'?[1.8,1,.5]:tall?[1.6,1,.55]:null)}
 if(id!=='kiwi'&&id!=='egg_legs'&&!PENG[id]&&!tall){const big=['eagle','phoenix','owl','vampire','stormeagle','auroraowl','pelican'].includes(id),wl=A?(big?.46:id==='hatch_wind'?.17:.34):.15,wc=WINGC[id]??(A?dkn3(c,.85):c);
  // 🪶 공중 새 날개: 팔 부분 + 덮깃 + 팀 색 띠 + 부채꼴 첫째날개깃(새마다 끝 색), 박쥐는 뾰족한 손가락 + 막
  const WTIP={seagull:0x1f2937,albatross:0x1f2937,blizgull:0x334155,pelican:0x1f2937,pigeon:0x475569,eagle:0x3b2414,stormeagle:0x312e81,falcon:0x44403c,crow:0x111827,ghostcrow:0x475569,plague:0x365314,pirate:0x3b2a1e,owl:0x5b3a1e,auroraowl:0x6366f1,lich:0x581c87,shadowowl:0x0f172a,bonecrow:0xe5e7eb,berserk:0x7f1d1d,thunderbird:0xfde047,parrot:[0xe53935,0x1e88e5],phoenix:[0xef4444,0xfde047],plasmabird:[0xfb923c,0x60a5fa],comet:[0xf43f5e,0xfde047],hatch_wind:0x5eead4};
  const featherWing=(s,P)=>{const bat=id==='vampire'||id==='voltbat',T=WTIP[id],n=big?5:id==='hatch_wind'?3:4,tc2=i=>Array.isArray(T)?T[i%2]:(T??dkn3(wc,.68)),go=id==='phoenix'||id==='plasmabird'||id==='comet'?GL(0xf97316):{};
   const W=SP(1,bat?dkn3(wc,.8):wc,go);W.scale.set(wl*.62,bat?.17:.2,.05);W.position.set(s*wl*.6,.03,0);P.add(W);
   if(!bat){const cv=SP(1,ltn3(wc));cv.scale.set(wl*.5,.09,.056);cv.position.set(s*wl*.56,-.07,.008);cv.name='cv';P.add(cv)}
   const tb=SP(1,oc);tb.userData.noStone=1;tb.scale.set(wl*.62,.03,.054);tb.position.set(s*wl*.62,.175,.004);P.add(tb);
   for(let i=0;i<n;i++){const t=n>1?i/(n-1):0,a=-.12+t*.8,len=wl*(bat?.62:.46)*(1-.18*t),F=SP(1,bat?0x1c1917:tc2(i),go);F.scale.set(len,bat?.022:.058,bat?.02:.026);F.rotation.z=s*a;
    F.position.set(s*(wl*1.02+Math.cos(a)*len*.78),.02+t*.1+Math.sin(a)*len*.78,-.004*i);P.add(F);
    if(bat&&i<n-1){const M=SP(1,wc);M.scale.set(len*.85,.1,.018);M.rotation.z=s*(a+.4);M.position.set(s*(wl*1.0+Math.cos(a+.4)*len*.55),.06+t*.1+Math.sin(a+.4)*len*.55,-.01);P.add(M)}}
   w.push(P)};
  /* ⚡ 천둥새 날개: 비뚤비뚤한 번개 모양(지그재그 띠, 끝이 뾰족) */const boltWing=(s,P)=>{const C=[[0,0],[.2,.1],[.14,-.04],[.38,.08],[.31,-.06],[.54,.04],[.48,-.05],[.7,0]],Wd=[.24,.22,.2,.17,.15,.12,.09,0],sh=new THREE.Shape();C.forEach(([x,y],i)=>i?sh.lineTo(x,y+Wd[i]/2):sh.moveTo(x,y+Wd[i]/2));for(let i=C.length-1;i>=0;i--)sh.lineTo(C[i][0],C[i][1]-Wd[i]/2);const geo=GC('boltw',()=>{const q=new THREE.ExtrudeGeometry(sh,{depth:.035,bevelEnabled:true,bevelThickness:.008,bevelSize:.008,bevelSegments:1});q.translate(0,0,-.017);return q});const B=M(geo,0xfde047,{side:THREE.DoubleSide,emissive:0xfacc15,emissiveIntensity:.35,roughness:.35});B.userData.noStone=1;B.scale.set(s*wl*1.75,wl*1.6,1);B.position.set(-s*.03,.03,0);P.add(B);w.push(P)};
  [-1,1].forEach(s=>{const P=new THREE.Group();P.position.set(s*.2,0,z0+.06);g.add(P);if(id==='thunderbird'){boltWing(s,P);return}if(A&&id!=='swan'){featherWing(s,P);return}const W=SP(1,A?wc:(WINGC[id]??dkn3(c,.88)),id==='phoenix'?GL(0xf97316):{});if(A){W.scale.set(wl,.25,.045);W.position.set(s*wl*.95,.04,0)}else{W.scale.set(.06,.19,.12);W.position.set(s*.05,.03,-.02);W.rotation.y=s*.25}if(A)W.rotation.z=s*.2;if(id==='swan'){W.rotation.y=-s*.4;W.position.set(s*wl*.9,.04,wl*.39)}P.add(W);
   if(A&&id!=='vampire'){const cv=SP(1,ltn3(wc));cv.scale.set(wl*.55,.16,.05);cv.position.set(s*wl*.55,-.03,id==='swan'?wl*.22+.012:.012);if(id==='swan')cv.rotation.y=-s*.4;P.add(cv)}
   if(A){const tp=SP(1,oc);tp.userData.noStone=1;tp.scale.set(wl*.5,.15,.035);tp.rotation.z=s*.45;tp.position.set(s*wl*1.6,.16,id==='swan'?wl*.72:0);if(id==='swan')tp.rotation.y=-s*.4;P.add(tp);w.push(P)}})}
 /* 팀 색 목 고리는 디자인을 해쳐서 뺐음(2026-11-11) — 팀 표시는 나중에 다른 방식으로 */
 const tc=(n,len,col,sp,o)=>{for(let i=0;i<n;i++){const a=(i-(n-1)/2)*sp,t=KO(.07,len,col[i%col.length],o);t.rotation.z=a;at(t,-Math.sin(a)*len/2,.3+Math.cos(a)*len/2,z0+.1)}};
 if(id==='turkey');else if(id==='phoenix')tc(5,.8,[0xf97316,0xfde047,0xef4444],.3,GL(0xf97316));else if(id==='plasmabird')tc(5,.7,[0xfb923c,0xfde047,0x60a5fa],.3,GL(0xfb923c));else if(id==='comet')tc(3,.6,[0xf43f5e,0xfb923c],.2,GL(0xf43f5e));else if(id==='parrot')tc(3,.5,[0xe53935,0x1e88e5,0xe53935],.22);else if(id==='rooster')tc(3,.5,[0x16a34a,0x111827],.3);else if(id==='ghostcrow'){/* 👻 유령 꼬리: 점점 가늘어지며 위로 말려 올라가는 연기 꼬리, matTick에서 살랑 */const ty=.26*BODYS[id][1]*.86,gt=[];for(let i=0;i<8;i++){const k=i/7,sg=SP(1,[0x94a3b8,0xa5b4c8,0xb8c4d6,0xcbd5e1,0xd8e0ea,0xe2e8f0,0xeef2f7,0xf8fafc][i]);const r=.16*(1-k*.8);sg.scale.set(r*1.15,r*1.3,r*.7);const y=ty-.06+i*.062,z=z0+.03+(k>.55?(k-.55)*(k-.55)*1.1:0)-k*.03;at(sg,0,y,z);sg.userData.gx=0;gt.push(sg)}const tip=KO(.025,.09,0xf8fafc);tip.rotation.x=-.5;at(tip,0,ty-.06+8*.062,z0+.25);gt.push(tip);g.userData.gtail=gt}
 else if(A&&id!=='swan'&&id!=='hatch_wind')[-.42,0,.42].forEach((a,i)=>{const f=SP(1,i===1?oc:dkn3(WINGC[id]??c,.85));if(i===1)f.userData.noStone=1;f.scale.set(.065,.2,.018);f.rotation.z=a;const ty=.26*((BODYS[id]||[1,1.25])[1])*.86;at(f,-Math.sin(a)*.17,ty+Math.cos(a)*.17,z0+.04)});// 🪶 공중 새 꼬리깃 부채(가운데는 팀 색)
 else if(id!=='kiwi'&&id!=='egg_legs'&&!PENG[id])tc(1,.3,[A?oc:c],0);
 const up=(r,h,col,x,y,z,o)=>{const e=KO(r,h,col,o);e.rotation.x=PI/2;at(e,x,y,z)};
 if(id==='rooster'){[0,1,2].forEach(i=>at(SP(.05,0xef4444),0,hy-.02+i*.06,hz+.15-i*.02));at(SP(.04,0xef4444),0,hy-.15,hz-.1)}
 if(id==='owl'||id==='auroraowl')[-1,1].forEach(s=>up(.045,.15,c,s*.12,hy,hz+.22));
 if(id==='pirate'){at(SP(.2,0x111827),0,hy+.02,hz+.14,[1.2,1.2,.3]);at(SP(.035,0xffffff),0,hy-.15,hz+.2)}
 
 if(id==='phoenix'){[-1,0,1].forEach(s=>up(.04,.2,0xfde047,s*.07,hy+.02,hz+.2,GL(0xfde047)))}
 if(id==='eagle'||id==='stormeagle')at(BX(.2,.04,.03,id==='eagle'?0x451a03:0x1e1b4b),0,hy-.08,hz+.1);
 if(id==='vampire')[-1,1].forEach(s=>{const f=KO(.02,.07,0xffffff);f.rotation.z=PI;at(f,s*.03,hy-.22,hz-.1)});
 if(id==='duck')at(TR(.14,.025,0xffffff),0,hy+.1,hz-.1);
 if(!A&&!tall&&id!=='egg_legs'&&id!=='crocbird')[-1,1].forEach(s=>at(BX(LF?.03:.045,LF?.03:.045,z0,id==='knight'?0xef4444:id==='crane'?0x57534e:0xf97316),s*.1,-.02,z0/2-.04));
 const bz=tall?1.7:.85+LF,bg=new THREE.Mesh(new THREE.PlaneGeometry(.6,.09),new THREE.MeshBasicMaterial({color:0}));bg.position.set(0,.45,bz);
 const f=new THREE.Mesh(new THREE.PlaneGeometry(.56,.06),new THREE.MeshBasicMaterial({color:0x22c55e}));f.position.set(0,.45,bz+.01);f.name='f';g.add(bg,f);
 g.scale.setScalar(b.id==='crocbird'?1.2:.7+Math.min(.9,b.hp/3500));return g}
function rmM(m){Sc.remove(m);m.traverse(o=>{if(o.material)o.material.dispose();if(o.geometry&&!o.geometry.userData.cached)o.geometry.dispose()})}
function skFx(s){const m=new THREE.Mesh(new THREE.PlaneGeometry(COLS+1,BH+1),new THREE.MeshBasicMaterial({color:TECH[s.c.k[0]].col,transparent:true,opacity:.5}));m.position.set((COLS+.5)/2,BH/2,.9);Sc.add(m);fx.push([m,1,1]);
 const r=new THREE.Mesh(new THREE.RingGeometry(1,1.4,32),new THREE.MeshBasicMaterial({color:TECH[s.c.k[1]].col,transparent:true,opacity:.8}));r.position.set((COLS+.5)/2,BH/2,1);Sc.add(r);fx.push([r,1,1,1])}
let wireL=null,wireRef=null,snackM=[];const wireMat=new THREE.MeshBasicMaterial({color:0x292524}),wireGlow=[0xfde047,0xfb923c,0xf43f5e].map(c=>new THREE.MeshBasicMaterial({color:c,transparent:true,opacity:.3,depthWrite:false}));const snackMat=new THREE.MeshStandardMaterial({color:0xf59e0b,emissive:0x92400e,emissiveIntensity:.3,roughness:.5});
function syncExtras(p,dt){if(p.wires!==wireRef){wireRef=p.wires;if(wireL){Sc.remove(wireL);wireL=null}
  if(p.wires&&p.wires.length){wireL=new THREE.Group();const geo=GC('wire',()=>new THREE.BoxGeometry(1,.05,.05)),glo=GC('wireg',()=>new THREE.BoxGeometry(1,.11,.11));
   p.wires.forEach(w=>{const x1=w.x1,y1=BH-w.y1,x2=w.x2,y2=BH-w.y2,L=Math.hypot(x2-x1,y2-y1),a=Math.atan2(y2-y1,x2-x1);
    [[geo,wireMat],[glo,wireGlow[Math.min(2,Math.round((w.m-1)/.75))]]].forEach(([g,mt])=>{const m=new THREE.Mesh(g,mt);m.scale.x=L;m.rotation.z=a;m.position.set((x1+x2)/2,(y1+y2)/2,1.06);wireL.add(m)})});Sc.add(wireL)}}
 if(wireL)wireGlow.forEach((m,i)=>m.opacity=(.18+.12*i)+.2*Math.abs(Math.sin(S.t*(8+i*3))));
 const sn=p.snacks||[];while(snackM.length<sn.length){const g=new THREE.Group();for(let i=0;i<3;i++){const k=new THREE.Mesh(GC('snk',()=>new THREE.BoxGeometry(.16,.05,.05)),snackMat);k.rotation.z=i*1.1;k.position.set((i-1)*.05,(i%2)*.04,.04);g.add(k)}Sc.add(g);snackM.push(g)}
 snackM.forEach((g,i)=>{const s=sn[i];g.visible=!!s;if(s){g.position.set(s.x,BH-s.y,.03);g.rotation.z=i;g.scale.set(1.7/XK,1.7,1.7)}})}
function beam(x,y,u,col){if(fx.length>140)return;const l=new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(x,y,.7),new THREE.Vector3(u.x,BH-u.y,u.bp.t==='A'&&!(u.gr>0)?1.4:.4)]),new THREE.LineBasicMaterial({color:col}));Sc.add(l);fx.push([l,.09])}
function beamU(a,b,col){if(fx.length>140)return;const z=u=>u.bp.t==='A'&&!(u.gr>0)?1.4:.4,l=new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(a.x,BH-a.y,z(a)),new THREE.Vector3(b.x,BH-b.y,z(b))]),new THREE.LineBasicMaterial({color:col}));Sc.add(l);fx.push([l,.12])}
// 💬 말하는 새(욕쟁이 앵무새): 말풍선 그림은 문장마다 1장만 만들어 모든 앵무새가 같이 써요
const TALKT={};function talkTex(b,i){const k=b.id+i;if(TALKT[k])return TALKT[k];const cv=document.createElement('canvas');cv.width=512;cv.height=176;const x=cv.getContext('2d');
 x.fillStyle='#fff';x.strokeStyle='#111';x.lineWidth=10;x.beginPath();x.moveTo(40,10);x.lineTo(472,10);x.quadraticCurveTo(502,10,502,40);x.lineTo(502,106);x.quadraticCurveTo(502,136,472,136);
 x.lineTo(290,136);x.lineTo(256,170);x.lineTo(222,136);x.lineTo(40,136);x.quadraticCurveTo(10,136,10,106);x.lineTo(10,40);x.quadraticCurveTo(10,10,40,10);x.closePath();x.fill();x.stroke();
 const t=b.talk[i];let fs=64;x.fillStyle='#111';x.textAlign='center';x.textBaseline='middle';do{x.font=`900 ${fs}px Jua, "Black Han Sans", sans-serif`;fs-=4}while(x.measureText(t).width>460&&fs>24);x.fillText(t,256,75);
 return TALKT[k]=new THREE.CanvasTexture(cv)}
function mkTowerMesh(b,lv){const m=artFx('towerMesh',{b,lv:lv||1})||towerMesh3(b);artFx('tower',{m,b,lv:lv||1});return m}
const NEWT=['snack','pylon','net','cctv','ember','lava','sun','frost','bliz','static','storm','breeze','twister','acid'];
function comboTowerMesh(b){const g=new THREE.Group(),sp=[];g.userData.sp=sp;const c1=TECH[b.combo[0]].col,c2=TECH[b.combo[1]].col,v=COMBO.findIndex(c=>c.t===b.id);
 const at=(m,x,y,z,p)=>{m.position.set(x,y,z);(p||g).add(m);return m},rot=(z,s)=>{const q=new THREE.Group();q.position.z=z;q.userData.v=s;sp.push(q);g.add(q);return q},up=m=>{m.rotation.x=PI/2;return m};
 at(CY(.42,.46,.12,0x334155),0,0,.06);at(TR(.42,.03,b.col,GL(b.col)),0,0,.13);
 at(CY(.12,.17,.75,c1,{emissive:c1,emissiveIntensity:.3}),-.1,0,.48);at(CY(.12,.17,.75,c2,{emissive:c2,emissiveIntensity:.3}),.1,0,.48);
 const top=v%3===0?SP(.21,0xffffff,GL(b.col)):v%3===1?up(KO(.18,.42,0xffffff,GL(b.col))):TR(.17,.06,b.col,GL(b.col));at(top,0,0,1.02);
 const r1=rot(.8,2.4);[0,1,2].forEach(i=>at(SP(.065,c1,GL(c1)),Math.cos(i*2.09)*.36,Math.sin(i*2.09)*.36,0,r1));
 const r2=rot(.45,-1.8);at(TR(.4,.025,c2,GL(c2)),0,0,0,r2);[0,1].forEach(i=>at(SP(.055,c2,GL(c2)),Math.cos(i*PI)*.4,Math.sin(i*PI)*.4,0,r2));
 return g}
// ---------- 🏰 종족 전용 3D 모델 ----------
function raceTowerMesh(b){const g=new THREE.Group(),sp=[];g.userData.sp=sp;const c=b.col,rc=RACE[b.race].c3,id=b.id;
 const at=(m,x,y,z,p)=>{m.position.set(x,y,z);(p||g).add(m);return m},rot=(z,v)=>{const q=new THREE.Group();q.position.z=z;q.userData.v=v;sp.push(q);g.add(q);return q},up=m=>{m.rotation.x=PI/2;return m};
 at(CY(.4,.44,.1,0x475569),0,0,.05);at(TR(.36,.03,rc,GL(rc)),0,0,.12);
 if(id==='keep'){at(BX(.42,.42,.55,0x94a3b8),0,0,.38);[[-1,-1],[1,-1],[-1,1],[1,1]].forEach(e=>at(BX(.1,.1,.2,0x94a3b8),e[0]*.17,e[1]*.17,.75));at(KO(.3,.34,c),0,0,.95);at(SP(.06,0xfef3c7,GL(0xfde047)),0,0,1.2)}
 else if(id==='bell'){[-1,1].forEach(s=>at(CY(.05,.06,.9,0x713f12),s*.2,0,.55));at(BX(.5,.06,.06,0x713f12),0,0,1);at(KO(.15,.26,0xfbbf24,GL(0xf59e0b)),0,0,.82).rotation.x=PI;
  const r=rot(.5,2.4);[0,1,2].forEach(i=>at(SP(.06,0xfde68a,GL(0xfbbf24)),Math.cos(i*2.09)*.27,Math.sin(i*2.09)*.27,0,r))}
 else if(id==='ballista'){at(BX(.46,.16,.12,0x713f12),0,0,.4);[-1,1].forEach(s=>{const l=BX(.3,.05,.06,0x92400e);l.rotation.z=s*.7;at(l,s*.2,.1,.42)});
  const bolt=up(KO(.04,.5,0xe5e7eb));at(bolt,0,-.1,.5);at(BX(.05,.4,.05,0x7f1d1d),0,.12,.5);at(SP(.06,c,GL(c)),0,.3,.5)}
 else if(id==='spikes'){for(let i=0;i<8;i++){const k=KO(.06,.34,i%2?c:0x78350f);const a=i*PI/4;k.position.set(Math.cos(a)*.24,Math.sin(a)*.24,.28);k.rotation.x=Math.sin(a)*.5;k.rotation.y=-Math.cos(a)*.5;g.add(k)}at(KO(.09,.4,c),0,0,.32)}
 else if(id==='scarecrow'){at(CY(.04,.05,.9,0x57534e),0,0,.5);at(BX(.5,.05,.05,0x57534e),0,0,.72);at(SP(.13,0xf5f5f4),0,0,.98);at(SP(.03,0x111111),-.05,-.1,1.0);at(SP(.03,0x111111),.05,-.1,1.0);
  const r=rot(.55,2);[0,1,2].forEach(i=>at(SP(.06,0xa78bfa,Object.assign({},TP,GL(0xa78bfa))),Math.cos(i*2.09)*.26,Math.sin(i*2.09)*.26,0,r))}
 else if(id==='tomb'){at(BX(.4,.12,.5,0x6b7280),0,0,.38);at(CY(.2,.2,.12,0x6b7280),0,0,.64);at(BX(.05,.05,.2,0xe5e7eb),0,-.07,.42);at(BX(.18,.05,.05,0xe5e7eb),0,-.07,.46);
  const r=rot(.2,-1.6);[0,1,2].forEach(i=>at(SP(.06,0x86efac,Object.assign({},TP,GL(0x22c55e))),Math.cos(i*2.09)*.3,Math.sin(i*2.09)*.3,0,r))}
 else if(id==='moonbow'){at(CY(.04,.06,1,0x713f12),0,0,.6);const m=TR(.3,.035,c,GL(c));m.rotation.x=PI/2;at(m,0,0,1.05);at(BX(.02,.02,.58,0xe5e7eb),0,0,1.05);at(up(KO(.03,.3,0xfef3c7)),0,-.2,1.05)}
 else if(id==='thorn'){at(CY(.12,.16,.3,0x166534),0,0,.2);for(let i=0;i<7;i++){const a=i*PI*2/7,k=KO(.05,.4,i%2?0x16a34a:0x15803d);k.position.set(Math.cos(a)*.16,Math.sin(a)*.16,.42);k.rotation.x=Math.sin(a)*.6;k.rotation.y=-Math.cos(a)*.6;g.add(k)}at(SP(.08,0xf9a8d4,GL(0xec4899)),0,0,.58)}
 else{at(KO(.28,.6,c),0,0,.45)}
 return g}
function raceBird(b,g,at,up){const rc=RACE[b.race].c3,c=b.col,id=b.id;
 const LF=LIFT[id]||0;
 if(id==='knight'){at(KO(.13,.22,0x60a5fa,GL(0x3b82f6)),0,-.3,.64+LF);at(SP(1,0x60a5fa,GL(0x3b82f6)),.3,-.05,.3+LF,[.03,.17,.2])}
 else if(id==='priest'){at(BX(.05,.05,.24,0xffffff,GL(0xffffff)),0,0,.72);at(BX(.17,.05,.05,0xffffff,GL(0xffffff)),0,0,.74)}
 else if(id==='berserk'){[-1,1].forEach(s=>{const h=KO(.04,.2,0xfef3c7);h.rotation.z=s*.5;at(h,s*.1,-.3,.62)})}
 else if(id==='warturkey'){[-.12,0,.12].forEach(y=>at(KO(.05,.2,0xfef3c7),0,y,.56))}
 else if(id==='bonecrow'){at(SP(.07,0xf5f5f4),0,-.3,.64);at(BX(.4,.04,.04,0xe5e7eb),0,.05,.5);at(BX(.04,.4,.04,0xe5e7eb),0,.05,.5)}
 else if(id==='lich'){at(KO(.14,.26,0x4c1d95),0,-.3,.66);at(SP(.09,0xc4b5fd,GL(0xa78bfa)),0,0,.85)}
 else if(id==='shadowowl'){[-1,1].forEach(s=>{at(SP(.04,0xfde047,GL(0xfacc15)),s*.07,-.42,.5);at(KO(.04,.12,0x0f172a),s*.09,-.3,.66)})}
 else if(id==='mosscrane'){at(KO(.07,.2,0x4ade80),.08,.05,.58).rotation.z=-.5;at(KO(.06,.16,0x16a34a),-.08,.1,.55).rotation.z=.5}}
function towerMesh3(b){if(b.race)return raceTowerMesh(b);if(b.combo)return comboTowerMesh(b);if(!NEWT.includes(b.id))return towerMesh2(b);
 const g=new THREE.Group(),sp=[],id=b.id;g.userData.sp=sp;
 const at=(m,x,y,z,p)=>{m.position.set(x,y,z);(p||g).add(m);return m},rot=(z,v)=>{const q=new THREE.Group();q.position.z=z;q.userData.v=v;sp.push(q);g.add(q);return q},up=m=>{m.rotation.x=PI/2;return m};
 at(CY(.4,.44,.1,0x475569),0,0,.05);
 if(id==='snack'){at(BX(.44,.34,.34,0xdc2626),0,0,.27);at(BX(.46,.36,.06,0xfde047),0,0,.42);for(let i=0;i<7;i++){const k=BX(.18,.045,.045,0xf59e0b);k.rotation.z=i*.9;k.rotation.y=(i%3-1)*.4;at(k,Math.cos(i*2.4)*.1,Math.sin(i*2.4)*.08,.5+(i%3)*.04)}
  const r=rot(.75,2);[0,1,2].forEach(i=>{const k=BX(.12,.04,.04,0xfbbf24);k.rotation.z=i;at(k,Math.cos(i*2.09)*.3,Math.sin(i*2.09)*.3,0,r)})}
 else if(id==='pylon'){at(CY(.05,.07,1.05,0x78350f),0,0,.55);at(BX(.56,.06,.06,0x57534e),0,0,1);[-1,1].forEach(s=>at(SP(.045,0x93c5fd,GL(0x60a5fa)),s*.24,0,1.06));
  at(SP(.07,0x92400e),.12,0,1.1);at(SP(.045,0x92400e),.17,-.03,1.17);const k=KO(.02,.05,0xf59e0b);k.rotation.z=PI/2;at(k,.22,-.03,1.17)}
 else if(id==='cctv'){at(CY(.05,.07,.95,0x64748b),0,0,.5);const hd=BX(.34,.28,.26,0x6d28d9);at(hd,0,-.05,1.05);[-1,1].forEach(s=>{at(SP(.09,0xfef3c7,GL(0xfde047)),s*.08,-.2,1.08);at(SP(.045,0x111111),s*.08,-.27,1.08)});[-1,1].forEach(s=>at(KO(.05,.12,0x6d28d9),s*.13,-.05,1.24).rotation.x=PI/2);
  const sc=new THREE.Mesh(GC('scanR',()=>new THREE.RingGeometry(.96,1,48)),new THREE.MeshBasicMaterial({color:0xa78bfa,transparent:true,opacity:.45,depthWrite:false}));sc.name='scan';sc.position.z=.04;g.add(sc);
  const sw=new THREE.Mesh(GC('scanW',()=>new THREE.CircleGeometry(1,24,0,.7)),new THREE.MeshBasicMaterial({color:0xc4b5fd,transparent:true,opacity:.16,depthWrite:false}));sw.name='scanw';sw.position.z=.05;g.add(sw)}
 else if(id==='net'){at(CY(.05,.07,.8,0x9ca3af),0,0,.45);const h=TR(.26,.03,0x22d3ee,GL(0x0891b2));h.rotation.x=PI/2.6;at(h,0,-.08,1.02);const n=CY(.25,.25,.01,0xe0f2fe,Object.assign({},TP,{opacity:.45}));n.rotation.x=PI/2.6+PI/2;at(n,0,-.08,1.02);
  const r=rot(.3,1.2);[0,1,2,3].forEach(i=>at(SP(.04,0x67e8f9,GL(0x22d3ee)),Math.cos(i*PI/2)*.35,Math.sin(i*PI/2)*.35,0,r))}
 else if(id==='ember'){at(TR(.26,.08,0x78350f),0,0,.2);at(SP(.13,0xfbbf24,GL(0xf97316)),0,0,.32);const r=rot(.22,3);[0,1,2].forEach(i=>at(up(KO(.07,.38,0xf97316,GL(0xea580c))),Math.cos(i*2.09)*.15,Math.sin(i*2.09)*.15,0,r))}
 else if(id==='lava'){at(up(KO(.4,.62,0x44403c)),0,0,.41);at(SP(.13,0xef4444,GL(0xdc2626)),0,0,.7);const r=rot(.55,1.6);[0,1,2,3].forEach(i=>at(SP(.05,0xf97316,GL(0xf97316)),Math.cos(i*PI/2)*.3,Math.sin(i*PI/2)*.3,0,r))}
 else if(id==='sun'){at(CY(.11,.17,1,0xe7e5e4),0,0,.6);at(SP(.2,0xfde047,GL(0xfacc15)),0,0,1.2);const r=rot(1.2,1.2);for(let i=0;i<8;i++){const s=BX(.16,.04,.04,0xfacc15,GL(0xf59e0b));s.rotation.z=i*PI/4;at(s,Math.cos(i*PI/4)*.33,Math.sin(i*PI/4)*.33,0,r)}}
 else if(id==='frost'){const cm=Object.assign({},TP,GL(0x22d3ee));at(up(KO(.12,.9,0x67e8f9,cm)),0,0,.55);[[.18,.08],[-.16,.12],[0,-.2]].forEach(e=>at(up(KO(.07,.5,0xa5f3fc,cm)),e[0],e[1],.35));const r=rot(.9,1.4);[0,1,2].forEach(i=>{const s=BX(.5,.03,.03,0xecfeff,GL(0x67e8f9));s.rotation.z=i*PI/3;at(s,0,0,0,r)})}
 else if(id==='bliz'){at(CY(.18,.24,.6,0xe2e8f0),0,0,.4);[[.15,0],[-.13,.1],[0,-.15],[0,.14]].forEach(e=>at(SP(.17,0xf8fafc,{transparent:true,opacity:.9}),e[0],e[1],.85));const r=rot(.5,2.2);for(let i=0;i<6;i++)at(SP(.045,0xffffff,GL(0xbae6fd)),Math.cos(i*PI/3)*.42,Math.sin(i*PI/3)*.42,0,r)}
 else if(id==='static'){at(CY(.04,.06,.8,0x9ca3af,{metalness:.8,roughness:.3}),0,0,.5);for(let i=0;i<3;i++){const f=SP(.07,0xfde047);f.scale.set(.5,.18,2.2);f.rotation.y=(i-1)*.45;at(f,(i-1)*.1,0,1)}const r=rot(.75,4);[0,1,2,3].forEach(i=>at(SP(.04,0xffffff,GL(0xfde047)),Math.cos(i*PI/2)*.3,Math.sin(i*PI/2)*.3,0,r))}
 else if(id==='storm'){at(CY(.05,.08,.7,0x475569),0,0,.4);[[.18,0],[-.16,.1],[0,-.14],[0,.15]].forEach(e=>at(SP(.18,0x4c1d95),e[0],e[1],.95));const r=rot(.6,-2);[[.05,.12],[-.05,0],[.05,-.12]].forEach((e,i)=>{const s=BX(.06,.04,.18,0xfde047,GL(0xfacc15));s.rotation.y=i%2?.6:-.6;at(s,.25+e[0],0,e[1],r)});at(TR(.38,.025,0x818cf8,GL(0x6366f1)),0,0,0,r)}
 else if(id==='breeze'){at(CY(.05,.08,.7,0xd6d3d1),0,0,.4);const r=rot(.8,6);at(SP(.06,0x0f766e),0,0,0,r);[0,1,2].forEach(i=>{const q=new THREE.Group();q.rotation.z=i*2.09;at(BX(.28,.08,.02,0x5eead4),.17,0,0,q);r.add(q)})}
 else if(id==='twister'){[0,1,2,3].forEach(i=>{const r=rot(.3+i*.22,(i%2?-1:1)*(3+i)),R=.12+i*.08;at(TR(R,.035,0x38bdf8,Object.assign({},TP,GL(0x0ea5e9))),0,0,0,r)});at(up(KO(.1,.25,0xe0f2fe,GL(0x7dd3fc))),0,0,1.25)}
 else if(id==='acid'){at(CY(.38,.38,.05,0x65a30d,Object.assign({},TP,GL(0x4d7c0f))),0,0,.12);const r=rot(.2,1.1);[[.2,.05,.07],[-.15,.15,.05],[-.05,-.2,.06],[.1,-.1,.04]].forEach(e=>at(SP(e[2],0xbef264,GL(0x84cc16)),e[0],e[1],0,r));at(SP(.09,0xf5f5f4),0,0,.25)}
 return g}
/* 🪨 돌(화석) 재질: 밝기만 남겨 사암·회색 돌 색으로 바꾸고, 각진 면(flatShading)과 거친 표면으로. 눈(아주 어둡거나 아주 흰 부분)과 외곽선은 그대로 */
const WHT3=new THREE.Color(0xffffff);let STX=null;function stoneTex(){if(STX)return STX;const c=document.createElement('canvas');c.width=c.height=64;const x=c.getContext('2d');x.fillStyle='#bdbdbd';x.fillRect(0,0,64,64);
 for(let i=0;i<900;i++){const v=150+Math.floor(Math.random()*100);x.fillStyle=`rgb(${v},${v},${v})`;x.fillRect(Math.random()*64|0,Math.random()*64|0,1+(Math.random()*2|0),1+(Math.random()*2|0))}
 x.strokeStyle='#6b6b6b';x.lineWidth=1;for(let i=0;i<5;i++){x.beginPath();let px=Math.random()*64,py=Math.random()*64;x.moveTo(px,py);for(let k=0;k<4;k++){px+=Math.random()*16-8;py+=Math.random()*16-8;x.lineTo(px,py)}x.stroke()}
 STX=new THREE.CanvasTexture(c);STX.wrapS=STX.wrapT=THREE.RepeatWrapping;STX.repeat.set(2,2);return STX}
function stoneify(g,half){const R=[0x34312d,0x4c4842,0x67625a,0x827c72,0x9c968b],tmp=new THREE.Color();g.traverse(o=>{if(!o.isMesh||!o.material||o.name==='artOutl'||o.userData.noStone)return;
  const mats=Array.isArray(o.material)?o.material:[o.material];o.material=mats.map(m=>{if(!m.color)return m;/* 팀 색 부품은 userData.noStone으로 건너뜀 */const L=m.color.r*.3+m.color.g*.59+m.color.b*.11;const sat=Math.max(m.color.r,m.color.g,m.color.b)-Math.min(m.color.r,m.color.g,m.color.b);if(L<.06||L>.97||(!half&&m.color.g>m.color.r*1.2&&m.color.g>m.color.b*1.2)||(half&&sat>.12&&L>.75))return m;
   const n=m.clone();if(!half||sat<=.12){tmp.setHex(R[Math.min(4,Math.floor(L*5.2))]);n.color.copy(tmp)}else n.color.multiplyScalar(1.12);if('roughness'in n){n.roughness=1;n.metalness=0;n.bumpMap=stoneTex();n.bumpScale=.035}if(!n.map&&o.geometry&&o.geometry.attributes.uv)n.map=stoneTex();if('flatShading'in n)n.flatShading=true;if(n.emissive)n.emissive.setHex(0);n.needsUpdate=true;return n});if(o.material.length===1)o.material=o.material[0]})}
/* 🎨 새 재질(질감) 상자: U의 mat:'fire'|'ice'|'ghost'|'elec'|'gold'. 코드로 그린 작은 무늬 그림 + 빛·투명도. 움직이는 재질은 m.userData.fxm에 담아 sync3에서 깜빡임 */
const MTX={};function matTex(k){if(MTX[k])return MTX[k];const N=128,c=document.createElement('canvas');c.width=c.height=N;const x=c.getContext('2d'),R=Math.random,line=(n,w,col,j)=>{x.strokeStyle=col;x.lineWidth=w;for(let i=0;i<n;i++){x.beginPath();let px=R()*N,py=R()*N;x.moveTo(px,py);for(let s=0;s<6;s++){px+=(R()-.5)*j;py+=(R()-.5)*j;x.lineTo(px,py)}x.stroke()}};
 if(k==='fireMap'){x.fillStyle='#d9d9d9';x.fillRect(0,0,N,N);for(let i=0;i<160;i++){const v=110+R()*120|0;x.fillStyle=`rgb(${v},${v*.8|0},${v*.7|0})`;x.beginPath();x.arc(R()*N,R()*N,2+R()*6,0,7);x.fill()}line(16,5,'#2a1810',30)}
 else if(k==='fireGlow'){x.fillStyle='#000';x.fillRect(0,0,N,N);x.shadowColor='#ffb000';x.shadowBlur=6;line(16,3,'#fff',30);x.shadowBlur=0;for(let i=0;i<40;i++){x.fillStyle='#ffd27a';x.fillRect(R()*N|0,R()*N|0,2,2)}}
 else if(k==='ice'){x.fillStyle='#d8eef8';x.fillRect(0,0,N,N);for(let i=0;i<30;i++){const px=R()*N,py=R()*N,r=6+R()*14;x.strokeStyle='rgba(255,255,255,.9)';x.lineWidth=1;for(let a=0;a<6;a++){x.beginPath();x.moveTo(px,py);x.lineTo(px+Math.cos(a*1.047)*r,py+Math.sin(a*1.047)*r);x.stroke()}}line(10,1,'#9cc8de',40)}
 else if(k==='ghost'){const g=x.createLinearGradient(0,0,0,N);g.addColorStop(0,'#fff');g.addColorStop(1,'#8a90a0');x.fillStyle=g;x.fillRect(0,0,N,N);x.globalAlpha=.35;for(let i=0;i<14;i++){x.fillStyle='#fff';x.beginPath();x.ellipse(R()*N,R()*N,4+R()*10,10+R()*20,0,0,7);x.fill()}x.globalAlpha=1}
 else if(k==='elec'){x.fillStyle='#000';x.fillRect(0,0,N,N);x.shadowColor='#fff';x.shadowBlur=6;line(6,4,'#fff',46);line(10,2,'#e0f0ff',26)}
 else if(k==='gold'){x.fillStyle='#e8e8e8';x.fillRect(0,0,N,N);for(let i=0;i<N;i+=4){x.fillStyle=`rgba(255,255,255,${.15+R()*.25})`;x.fillRect(0,i,N,2)}for(let i=0;i<25;i++){x.fillStyle='#fff';const px=R()*N,py=R()*N;x.fillRect(px-3,py,7,1);x.fillRect(px,py-3,1,7)}}
 const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(2,2);return MTX[k]=t}
const MATK={fire:{em:0xffc23a,ei:1.4},ice:{em:0x7dd3fc,ei:.25},ghost:{em:0xc7d2fe,ei:.4},elec:{em:0xfde047,ei:.35},gold:{em:0xfacc15,ei:.25}};
/* 무늬 좌표(uv)가 없는 몸통 모양에는 공 모양으로 감싸는 좌표를 만들어 줌 */function ensureUV(geo){if(!geo||geo.attributes.uv||!geo.attributes.position)return!!(geo&&geo.attributes.uv);const p=geo.attributes.position,n=p.count,a=new Float32Array(n*2);geo.computeBoundingBox();const c=geo.boundingBox.getCenter(new THREE.Vector3());for(let i=0;i<n;i++){const x=p.getX(i)-c.x,y=p.getY(i)-c.y,z=p.getZ(i)-c.z,r=Math.hypot(x,y,z)||1;a[i*2]=.5+Math.atan2(y,x)/(2*PI);a[i*2+1]=.5+Math.asin(Math.max(-1,Math.min(1,z/r)))/PI}geo.setAttribute('uv',new THREE.BufferAttribute(a,2));return true}
function matFx(g,k,b){const K=MATK[k];if(!K)return;const fx=[];g.traverse(o=>{if(!o.isMesh||!o.material||o.name==='artOutl'||o.name==='f'||o.userData.noStone||!o.material.color||!('roughness'in o.material))return;
  const c=o.material.color,L=c.r*.3+c.g*.59+c.b*.11;if(L<.06||L>.97)return;
  if(k==='fire'&&!(c.r>c.b*1.3&&c.r>.5))return;const uv=ensureUV(o.geometry),n=o.material.clone();
  if(k==='fire'){if(uv){n.map=matTex('fireMap');n.emissiveMap=matTex('fireGlow');n.map.repeat.set(1.5,1.5);n.emissiveMap.repeat.set(1.5,1.5)}n.emissive.setHex(K.em);n.emissiveIntensity=K.ei;n.roughness=.85;fx.push([n,'fire',Math.random()*9])}
  else if(k==='ice'){if(uv){n.map=matTex('ice');n.bumpMap=matTex('ice');n.bumpScale=.02}n.transparent=true;n.opacity=.82;n.roughness=.12;n.metalness=.15;n.emissive.setHex(K.em);n.emissiveIntensity=K.ei;n.flatShading=true;fx.push([n,'ice',Math.random()*9])}
  else if(k==='ghost'){if(uv)n.map=matTex('ghost');n.transparent=true;n.opacity=.62;n.depthWrite=false;n.emissive.setHex(K.em);n.emissiveIntensity=K.ei;fx.push([n,'ghost',Math.random()*9])}
  else if(k==='elec'){if(uv)n.emissiveMap=matTex('elec');n.emissive.setHex(K.em);n.emissiveIntensity=K.ei;n.roughness=.4;fx.push([n,'elec',Math.random()*9])}
  else if(k==='gold'){if(uv){n.map=matTex('gold');n.bumpMap=matTex('gold');n.bumpScale=.01}n.metalness=.55;n.roughness=.28;n.emissive.setHex(K.em);n.emissiveIntensity=K.ei;fx.push([n,'gold',Math.random()*9])}
  n.needsUpdate=true;o.material=n});g.userData.fxm=fx}
/* 매 프레임: 불은 일렁, 전기는 가끔 번쩍, 유령은 숨쉬듯, 금은 반짝, 얼음은 은은하게 */
function matTick(m,t){const gt=m.userData.gtail;if(gt)gt.forEach((o,i)=>{o.position.x=Math.sin(t*3.2-i*.7)*.012*i});const fx=m.userData.fxm;if(!fx||!fx.length)return;for(const[n,k,ph]of fx){const q=t+ph;
  if(k==='fire'){n.emissiveIntensity=1.2+.5*Math.sin(q*7)+.3*Math.sin(q*17.3);if(n.emissiveMap)n.emissiveMap.offset.y=(q*.08)%1}
  else if(k==='elec'){const z=(q*1.7)%2.2;n.emissiveIntensity=z<.08||(z>.18&&z<.24)?3:.35+.15*Math.sin(q*30)}
  else if(k==='ghost')n.emissiveIntensity=.3+.25*Math.sin(q*2.2);
  else if(k==='gold')n.emissiveIntensity=.2+.35*Math.max(0,Math.sin(q*3))**8;
  else if(k==='ice')n.emissiveIntensity=.22+.08*Math.sin(q*1.5)}}
function birdMesh3(b,oc){const g=birdMesh2(b,oc),id=b.id,at=(m,x,y,z,s)=>{m.position.set(x,y,z);if(s)m.scale.set(s[0],s[1],s[2]);g.add(m);return m},up=m=>{m.rotation.x=PI/2;return m};
 if(b.race){raceBird(b,g,at,up);return g}
 if(b.combo){const c1=TECH[b.combo[0]].col,c2=TECH[b.combo[1]].col;// 조합 새: 안쪽 덮깃이 두 속성 색으로 은은하게 빛나요
  if(b.t==='A')(g.userData.w||[]).forEach((P,i)=>{const cv=P.getObjectByName('cv')||(P.children.length===3?P.children[1]:null);if(cv){const cc=i?c2:c1;cv.material.color.setHex(cc);cv.material.emissive.setHex(cc);cv.material.emissiveIntensity=.4}});
  if(id==='frostpeng'){at(SP(1,0xffffff),0,-.1,.32,[.18,.14,.27]);[-1,1].forEach(s=>{at(SP(1,0x93c5fd),s*.13,-.12,.67,[.03,.05,.07]);at(SP(1,0xf59e0b),s*.09,-.12,.02,[.06,.09,.025]);const f=SP(1,b.col);f.rotation.y=s*.35;at(f,s*.24,-.02,.4,[.045,.1,.2])})}
  return g}
 if(id==='egg_legs'){const L=LIFT[id];for(let i=0;i<4;i++){const k=BX(.1,.02,.02,0x78350f);k.rotation.y=i%2?.7:-.7;at(k,-.1+i*.07,-.24,.42+L+(i%2?.03:-.03))}at(BX(.11,.02,.02,0x111111),-.09,-.2,.5+L).rotation.y=.4;at(SP(.075,0x111111),.08,-.215,.4+L).scale.set(1,.35,1)}
 else if(id==='hatch_dino'){[0,1,2,3].forEach(i=>at(up(KO(.05,.14,0x166534)),0,-.05+i*.1,.5-i*.03));at(SP(.12,0xfffbeb),0,.1,.18,[1.3,1.1,.6])}
 else if(id==='hatch_wind'){at(SP(.15,oc,{roughness:.25}),0,.12,1.2,[1,1,1.15]);at(KO(.03,.05,oc),0,.12,1.02);at(SP(.035,0xffffff),-.05,.07,1.27)}
 else if(id.startsWith('hatch_')&&id!=='hatch_dark')at(SP(.13,0xfffbeb),0,.06,.16,[1.4,1.2,.55]);
 else if(id==='goose')at(SP(.055,0xf97316),0,-.49,.7);
 else if(PENG[id]){at(SP(1,0xffffff),0,-.1,.32,[.18,.14,.27]);[-1,1].forEach(s=>{at(SP(1,0xfbbf24),s*.13,-.12,.67,[.03,.05,.07]);at(SP(1,0xf59e0b),s*.09,-.12,.02,[.06,.09,.025]);const f=SP(1,b.col);f.rotation.y=s*.35;at(f,s*.24,-.02,.4,[.045,.1,.2])});const t=KO(.07,.14,b.col);t.rotation.x=-2.2;at(t,0,.2,.08)}
 else if(id==='peacock'){for(let i=0;i<9;i++){const a=(i-4)*.22,k=KO(.08,.7,[0x0e7490,0x15803d,0x1d4ed8][i%3]);k.rotation.z=a;at(k,-Math.sin(a)*.35,.3+Math.cos(a)*.35,.32);at(SP(.05,0xfacc15),-Math.sin(a)*.66,.3+Math.cos(a)*.66,.34)}
  [-1,0,1].forEach(s=>at(SP(.03,0x0ea5e9),s*.05,-.3,.66))}
 else if(id==='falcon'){at(BX(.06,.25,.03,0x44403c),0,.32,.3);[-1,1].forEach(s=>at(SP(.045,0xfacc15),s*.08,-.39,.52))}
 else if(id==='albatross')(g.userData.w||[]).forEach(P=>{P.scale.x=1.6;P.scale.y=.8});
 else if(id==='thunderbird'){const H=headPos(id);[-1,0,1].forEach(s=>at(up(KO(.035,.2,0xfde047,GL(0xfacc15))),s*.07,H.hy+.02,H.hz+H.hr))}
 else if(id==='crow')[-1,1].forEach(s=>at(SP(.03,0xfacc15,GL(0xfacc15)),s*.08,-.39,.52));
 else if(id==='eagle'){/* 🦅 가발(체력 절반이면 날아감) + 숨은 번쩍 머리 */const wg=new THREE.Group();wg.name='wig';[[0,0,0,.17],[-.11,.05,-.05,.09],[.11,.05,-.05,.09],[0,.12,-.04,.1],[-.06,-.1,.02,.07],[.06,-.1,.02,.07]].forEach(([x,y,z,r])=>{const q=SP(r,0x6b4423);q.scale.z=.62;q.position.set(x,y,z);wg.add(q)});at(wg,0,-.3,.6);
  const gl=SP(.165,0xfffbeb,{emissive:0xfff3b0,emissiveIntensity:1});gl.name='glare';gl.visible=false;at(gl,0,-.3,.5)}
 return g}
let talkN=0;function sync3(dt){sync3.talkOn=talkN;talkN=0;try{heroBoard(dt)}catch(e){}if(typeof PFX!=='undefined')PFX.update(dt);PXS.update(dt);if(typeof newsUpd==='function')newsUpd(dt);const p=S.pl[view],seen=new Set();
 p.grid.forEach((row,y)=>row.forEach((t,x)=>{if(!t)return;const k=y*8+x;seen.add(k);let m=tm.get(k);
  if(!m||m.userData.t!==t||m.userData.lv0!==t.lv){if(m)rmM(m);m=mkTowerMesh(t.bp,t.lv);m.userData.t=t;m.userData.lv0=t.lv;Sc.add(m);tm.set(k,m)}
  m.position.set(cellX(x,y),BH-cellY(y),0);const s=1+(t.lv-1)*.15;if(t.carrier){const cu=t.carrier;m.position.set(cu.x,BH-cu.y,1.25+Math.sin(S.t*6)*.05);craneCone(t,cellX(x,y),BH-cellY(y))}m.scale.set(s/XK,s,s);if(t.kick>0){t.kick=Math.max(0,t.kick-dt*7);const k=t.kick*t.kick;m.scale.set(s/XK*(1+.1*k),s*(1+.1*k),s*(1-.16*k))}/* 쏠 때 움찔 반동 */
  m.rotation.z=t.carrier?Math.sin(S.t*3)*.15:t.dis>0?Math.sin(S.t*30)*.2:0;if(t.carrier)m.scale.multiplyScalar(.62);
  {const em=t.emo&&t.emo.u>S.t?t.emo.i:null;let es=m.userData.emoS;if(em&&(!es||es.userData.i!==em)){if(es)m.remove(es);es=new THREE.Sprite(new THREE.SpriteMaterial({map:emoTexC(em),depthWrite:false,depthTest:false,transparent:true}));es.scale.set(.6,.6,1);es.renderOrder=8;es.userData.i=em;m.add(es);m.userData.emoS=es}
   if(es){es.visible=!!em;es.position.set(0,0,1.6+Math.sin(S.t*6)*.06)}/* 💢 삐짐 · 😵 눈부심 */
   let pp=m.getObjectByName('poop');const on=t.poop>S.t;if(on&&!pp){pp=new THREE.Group();pp.name='poop';[[0,0,0,.17],[.11,.07,.02,.09],[-.09,.08,.03,.07],[.03,-.1,.01,.06]].forEach(([x,y,z,r])=>{const q=new THREE.Mesh(new THREE.SphereGeometry(r,10,6),new THREE.MeshStandardMaterial({color:0xffffff,roughness:.5}));q.scale.z=.35;q.position.set(x,y,z);pp.add(q)});pp.position.z=1.05;m.add(pp)}if(pp)pp.visible=on}/* 💩 똥 얼룩 */
  if(t.bp.cctv){const r=t.r/s,a=m.getObjectByName('scan'),w=m.getObjectByName('scanw');if(a){a.scale.set(r,r,1);w.scale.set(r,r,1);w.rotation.z=S.t*1.6}}
  if(t.bp.id!=='wall'&&m.userData.lv!==t.lv){const old=m.getObjectByName('lvE');if(old){m.remove(old);old.traverse(o=>{if(o.material)o.material.dispose()})}const eg=new THREE.Group();eg.name='lvE';
   if(t.lv>=2){const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:starTex(t.lv),transparent:true,depthWrite:false}));sp.geometry.userData.cached=1;sp.scale.set(.5,.5,1);sp.position.set(.32,-.25,1.25);sp.renderOrder=6;eg.add(sp)}m.add(eg);m.userData.lv=t.lv}
  (m.userData.sp||[]).forEach(o=>o.rotation.z+=dt*o.userData.v*(t.dis>0?0:1))}));
 tm.forEach((m,k)=>{if(!seen.has(k)){rmM(m);tm.delete(k)}});craneCone(null);
 const us=new Set();
 p.units.forEach(u=>{us.add(u.id);let m=um.get(u.id);if(m&&m.userData.bp!==u.bp){rmM(m);um.delete(u.id);m=null}if(!m){m=birdMesh3(u.bp,parseInt(PC[u.owner].slice(1),16));artFx('bird',{m,b:u.bp,u});m.userData.bp=u.bp;Sc.add(m);um.set(u.id,m)}if(m.userData.fxm)matTick(m,S.t);
  if(u.bp.wig){const w=m.getObjectByName('wig'),gl=m.getObjectByName('glare');if(w)w.visible=!u.wg;if(gl){gl.visible=!!u.wg;gl.material.emissiveIntensity=.7+.8*Math.abs(Math.sin(S.t*4))}if(u.wgfx){u.wgfx=0;if(!S.sim){artFx('smoke',{x:u.x,y:BH-u.y,r:.6,col:0x6b4423});artFx('crit',{u})}}}
  m.visible=!(u.popT&&S.t<u.popT);m.position.set(u.x,BH-u.y,u.bp.t==='A'?(u.gr>0?.35:1.4):u.fl>0?.75+Math.sin(S.t*5)*.06:.05+(u.jt>0?Math.sin(PI*(1-u.jt/.5))*.9:0));{let bb=m.userData.bub;if(u.fl>0&&!bb){bb=m.userData.bub=new THREE.Mesh(new THREE.SphereGeometry(.42,16,12),new THREE.MeshStandardMaterial({color:0xbae6fd,emissive:0x7dd3fc,emissiveIntensity:.5,transparent:true,opacity:.42,roughness:.1,depthWrite:false}));bb.position.z=.28;const hl=new THREE.Mesh(new THREE.SphereGeometry(.07,8,6),new THREE.MeshBasicMaterial({color:0xffffff}));hl.position.set(-.18,-.2,.2);bb.add(hl);m.add(bb)}if(bb)bb.visible=u.fl>0}m.scale.x=m.scale.y/XK;
  // 💬 말하는 새: 끝까지 가는 동안 진행 25%·50%·75%에서 딱 한 마디씩(3번), 1.6초. 화면에 동시에 최대 3개
  if(u.bp.talk){let sp=m.userData.talk;const prog=u.y/BH,nx=u.tkN||0;
   if(nx<3&&prog>=(nx+1)*.25){u.tkN=nx+1;const A=sync3.tA=(sync3.tA||[]).filter(t=>t>S.t);if(A.length<3){u.tkI=nx%u.bp.talk.length;u.tkT=S.t+1.6;A.push(u.tkT)}}
   const i=u.tkI||0,on=u.tkT>S.t;
   if(!sp&&on){sp=m.userData.talk=new THREE.Sprite(new THREE.SpriteMaterial({map:talkTex(u.bp,i),depthTest:false,transparent:true}));sp.geometry.userData.cached=1;sp.renderOrder=30;sp.position.set(0,-.2,1.35);m.add(sp)}
   if(on)talkN++;if(sp){sp.visible=on;if(on){const tx=talkTex(u.bp,i);if(sp.material.map!==tx){sp.material.map=tx;sp.material.needsUpdate=true}const k=1/m.scale.y;sp.scale.set(2.5*k,.86*k,1)}}}
  if(u.bp.stealth){const st=u.y<BH*u.bp.stealth&&!u.seen;if(m.userData.st!==st){m.userData.st=st;m.traverse(o=>{if(o.material&&o.name!=='f'&&!(o.name||'').startsWith('art')){if(o.userData.op0===undefined)o.userData.op0=o.material.opacity;o.material.transparent=true;o.material.opacity=st?.3*o.userData.op0:o.userData.op0}})}}
  const sh=m.getObjectByName('shd');if(sh)sh.visible=u.sh>0;if(u.shb){u.shb=0;if(p.id===view&&!S.sim){PXS.play('ice/ice-shatter',u.x,BH-u.y,u.bp.t==='A'?1:0,{fit:1.2,add:true});artFx('crit',{u})}}
  (m.userData.w||[]).forEach((q,i)=>q.rotation.y=(i?-1:1)*Math.sin(S.t*14+u.id)*.5);if(m.userData.an)m.userData.an(S.t+u.id*.37,m);const body=m.children[0];body.rotation.z=Math.sin(S.t*10+u.x*5)*.18;
  const f=m.getObjectByName('f'),r=Math.max(0,Math.min(1,u.hp/u.bp.hp));f.scale.x=Math.max(.01,r);f.position.x=-(1-r)*.28;
  /* 체력바 = 보낸 사람 팀 색(길이로 체력), 보호막이면 하얗게 밝힘 */f.material.color.set(PC[u.owner]||'#22c55e');if(u.sh>0)f.material.color.lerp(WHT3,.55);
  body.material.color.setHex(u.hit>0?0xffffff:u.bn>0?0xf97316:u.ps>0?0x22c55e:u.pois>0?(u.bc?0xf97316:0x22c55e):u.stun>0?0x93c5fd:u.amp>0?0xbef264:(u.col||u.bp.col))});
 um.forEach((m,id)=>{if(!us.has(id)){rmM(m);um.delete(id)}});
 syncExtras(p,dt);lanePanel(dt);artFx('update',{dt,view,t:S.t});
 fx=fx.filter(e=>{e[1]-=dt;if(e[2]){e[0].material.opacity=Math.max(0,e[1]/e[2])*.5;if(e[3])e[0].scale.setScalar(1+(1-e[1])*4)}if(e[1]<=0){rmM(e[0]);return false}return true});
 R.render(Sc,Cam)}
function minimap(){const c=$('mm'),x=c.getContext('2d'),w=c.width,cx=w/2,o=w*.47,n=o*.52;x.clearRect(0,0,w,w);
 for(let i=0;i<8;i++){const a=-Math.PI/2+((i+S.off)%8)*Math.PI/4,p=S.pl[i];x.beginPath();x.arc(cx,cx,o,a,a+Math.PI/4);x.arc(cx,cx,n,a+Math.PI/4,a,true);x.closePath();
  x.fillStyle=!p.alive?'#14141a':view===i?'#ffffff73':'#ffffff14';x.fill();x.strokeStyle=p.alive?p.color:'#334155';x.lineWidth=view===i?5:2;x.stroke();
  const m=a+Math.PI/8,r=(o+n)/2;x.font='bold 12px monospace';x.textAlign='center';x.textBaseline='middle';x.fillStyle=p.life<30?'#ef4444':'#fff';
  const nk=S.net&&typeof NET!=='undefined'&&NET.nick?NET.nick(i):null;if(nk)x.fillStyle=p.life<30?'#ef4444':'#fde047';
  x.fillText((nk?Array.from(nk)[0]:((i+S.off)%8+1))+':'+(p.alive?p.life:'💀'),cx+r*Math.cos(m),cx+r*Math.sin(m))}
 x.fillStyle='#38bdf8';x.font='bold 14px sans-serif';x.fillText(view?((view+S.off)%8+1)+'번':'YOU',cx,cx)}

// ---------- UI ----------
let pd=[];const setH=(e,h)=>{if(e._h!==h){e._h=h;e.innerHTML=h}};const st=(id,v)=>{const e=$(id);if(e.textContent!==String(v))e.textContent=v};
let techPend=null,laneT=0,lanePick=null;
const hx6=(c,x,y,r)=>{c.beginPath();for(let i=0;i<6;i++){const a=Math.PI/6+i*Math.PI/3;c.lineTo(x+Math.cos(a)*r,y+Math.sin(a)*r)}c.closePath()};
const css=n=>'#'+n.toString(16).padStart(6,'0');
function laneTargets(){if(S.net==='guest'&&S.laneNet)return Object.assign({},S.laneNet.c);const cnt={};S.pl.forEach(p=>{if(p.alive&&p.id!==0){const n=p.units.filter(u=>u.owner===0).length;if(n)cnt[p.id]=n}});return cnt}
function lanePanel(dt){const box=$('lane');if(!box||!S)return;laneT+=dt;if(laneT<.12)return;laneT=0;
 const cnt=laneTargets(),ids=Object.keys(cnt).map(Number);let id=lanePick!==null&&S.pl[lanePick].alive&&(cnt[lanePick]||!ids.length)?lanePick:null;
 if(id===null)id=ids.length?ids.sort((a,b)=>cnt[b]-cnt[a])[0]:nextAlive(0);if(S.net==='guest'&&S.laneNet&&S.pl[S.laneNet.b]&&S.pl[S.laneNet.b].alive)id=S.laneNet.b;if(id===null||id===undefined){box.style.display='none';return}box.style.display='';
 const p=S.pl[id],cv=$('lanec'),c=cv.getContext('2d'),W=cv.width,H=cv.height,s=Math.min(W/(COLS+.6),H/(BH+.2)),ox=(W-(COLS+.5)*s)/2,oy=(H-BH*s)/2,X=x=>ox+x*s,Y=y=>oy+y*s;
 c.clearRect(0,0,W,H);
 for(let r=0;r<ROWS;r++)for(let q=0;q<COLS;q++){hx6(c,X(cellX(q,r)),Y(cellY(r)),s*.52);c.fillStyle=r===0?'#166534':r===ROWS-1?'#7f1d1d':(q+r)%2?'#14352a':'#10291f';c.fill()}
 const pa=bfs(p.grid,COLS>>1,0);if(pa){c.setLineDash([s*.25,s*.25]);c.strokeStyle='#38bdf899';c.lineWidth=Math.max(1,s*.12);c.beginPath();pa.forEach((n,i)=>{const x=X(cellX(n.x,n.y)),y=Y(cellY(n.y));i?c.lineTo(x,y):c.moveTo(x,y)});c.stroke();c.setLineDash([])}
 (p.wires||[]).forEach(w=>{c.strokeStyle=w.m>=2.5?'#f43f5e':w.m>=1.75?'#fb923c':'#fde047';c.lineWidth=Math.max(1,s*.14);c.beginPath();c.moveTo(X(w.x1),Y(w.y1));c.lineTo(X(w.x2),Y(w.y2));c.stroke()});
 p.grid.forEach((row,r)=>row.forEach((t,q)=>{if(!t||!t.bp)return;const x=X(cellX(q,r)),y=Y(cellY(r)),z=s*(t.bp.id==='wall'?.34:.4);c.fillStyle=t.bp.id==='wall'?'#a16207':css(t.bp.col);c.fillRect(x-z,y-z,z*2,z*2);if(t.lv>1){c.fillStyle='#fff';c.fillRect(x-z,y-z,z*2*(t.lv-1)/3,s*.12)}}));
 p.units.forEach(u=>{const mine=u.owner===0,x=X(u.x),y=Y(u.y),r=mine?Math.max(2,s*(.22+Math.min(.25,u.bp.hp/12000))):Math.max(1.2,s*.15),hp=Math.max(0,u.hp/u.bp.hp);
  c.fillStyle=mine?`hsl(${Math.round(hp*120)},90%,55%)`:'#94a3b888';c.beginPath();
  if(u.bp.t==='A'&&!(u.gr>0)){c.moveTo(x,y+r*1.2);c.lineTo(x-r,y-r*.8);c.lineTo(x+r,y-r*.8);c.closePath()}else c.arc(x,y,r,0,6.283);c.fill();if(mine){c.strokeStyle='#0008';c.lineWidth=1;c.stroke()}});
 const nm=p.name.replace(/^(\d+번) /,'$1 ');setH($('lanet'),`🎯 ${nm}${ids.length>1?' 🔄':''}`);
 setH($('lanes'),`<span title="진행 중">🐦${cnt[id]||0}</span> <span title="탈출">💥${(S.esc||{})[id]||0}</span> <span title="격추">❌${(S.kl||{})[id]||0}</span>`);
 $('lane').dataset.id=id}
function laneFit(){const m=document.querySelector('main'),sd=document.querySelector('.side'),cv=$('lanec');if(!m||!sd||!cv||!cv.style)return;const avail=m.clientHeight-sd.offsetHeight-56;const h=Math.max(90,Math.min(210,avail));cv.style.height=h+'px';cv.height=h*2;cv.width=192}
function ui(){const me=S.pl[0];
 $('tip').style.display=sel?'block':'none';if(sel)$('tip').textContent=`${sel.n} (${tcost(me,sel)}G) · 놓을 칸을 터치`;
 const ib=$('ib');const pa=view===0?bfs(me.grid,COLS>>1,0):null;if(pa)st('pl',pa.length);st('df',Math.round(defPow(S.pl[0])/(27000*BAL.need)*100));
 pd.forEach(m=>rmM(m));pd=[];
 if(pa&&sel)pa.forEach((q,i)=>{if(i%2)return;const m=SP(.07,0x38bdf8,GL(0x38bdf8));m.scale.x=1/XK;m.position.set(cellX(q.x,q.y),BH-cellY(q.y),.1);Sc.add(m);pd.push(m)});
 if(insp&&view===0){const t=insp.t,w=t.bp.id==='wall';ib.style.display='flex';
  setH(ib,`<span>${t.bp.ic} <b>${tName(t)}</b>${w?'':' '+'🥚'.repeat(t.lv)+(t.bp.cctv?' · 감지 '+t.r.toFixed(1)+'칸':' · 공격 '+t.d)}${t.bp.x?' · '+t.bp.x:''}</span><span>${w?'':`<button class="up${t.lv>=4?' mx':me.gold<upc(t,me)?' no':''}" onclick="upg0()"><i>${t.lv>=4?'👑':'⬆️'}</i><span>${t.lv>=4?'MAX':'Lv.'+t.lv+' → '+(t.lv+1)}<small>${t.lv>=4?'최대 강화':'💰 '+upc(t,me)+'G'}</small></span></button> `}<button class="rm" onclick="dem0()"><i>🔨</i><span>철거<small>💰 +${Math.floor(t.inv*refR(me))}G</small></span></button> <button onclick="insp=null;ui()">✕</button></span>`)}
 else ib.style.display='none';
 const sb=$('sb');sb.style.display='none';
 st('t1',`🏹 타워 ${tIcons(me)}`+(me.tech2?'':' · 🔮속성 '+(me.tech?'+1':'선택')));
 T.forEach(t=>{const bn=banOf(me,t)&&techOK(me,Object.assign({},t,{id:'_'}));t.el.style.display=techOK(me,t)||bn?'':'none';t.el.classList.toggle('rban',bn);t.el.classList.toggle('sel',sel===t);const lk=!!(t.cctv&&!cctvOK(me));t.el.classList.toggle('off',me.gold<tcost(me,t)||lk);if(t.el.children[2])t.el.children[2].textContent=tcost(me,t)+'G';if(t.cctv&&t.el.firstChild)t.el.firstChild.textContent=lk?'🔒':t.ic});
 {const sb=$('shB');if(sb&&sb.classList)sb.classList.toggle('t2',!!me.tech)}
 TK.forEach(k=>{const e=TECH[k].el;if(e){e.style.display=(has(me,k)||me.tech2)?'none':'';e.classList.toggle('sel',techPend===k);const cb=me.tech?comboOf(me.tech,k):null;if(e.lastChild)e.lastChild.textContent=me.tech?`${TECH2C}G · ${cb?TB[cb.t].ic+'조합':''}`:'무료'}});
 U.forEach(u=>{const vis=!u.hidden&&(!u.secret||eggHas(u.secret)),bn=vis&&banOf(me,u)&&techOK(me,Object.assign({},u,{id:'_'})),ok=techOK(me,u)&&vis;u.el.style.display=ok||bn?'':'none';u.el.classList.toggle('rban',bn);if(u.id==='egg_legs'&&u.el.children&&u.el.children[3])u.el.children[3].textContent=`+${u.inc} 🥚${EGG.n}`;u.el.classList.toggle('off',me.gold<ucost(me,u));if(u.el.children[2])u.el.children[2].textContent=ucost(me,u)+'G'});
 st('t2',`🪶 유닛 전송 (${U.filter(u=>techOK(me,u)&&!u.hidden&&(!u.secret||eggHas(u.secret))).length})`);
 {const tm=$('tm');if(tm&&tm.style)tm.style.color=S.lm>=3?'#f43f5e':S.lm>=2?'#fb923c':''}
 const s=skillOf(me),sk=$('skb');
 if(!s){sk.className='skb off';setH(sk,`<i>✨</i><b>조합 스킬</b><small>속성 2개 필요</small>`)}
 else if(!me.skU){sk.className='skb'+(me.gold<SKC?' off':'');setH(sk,`<i>${s.c.ic}</i><b>${s.n}</b><small>🔓 해금 ${SKC}G</small>`)}
 else{const r=me.skCD>0;sk.className='skb'+(r?' off':' rdy');setH(sk,`<i>${s.c.ic}</i><b>${s.n}</b><small>${r?'⏳ '+Math.ceil(me.skCD)+'초':'▶ 발동!'}</small>`)}}
function cdnUI(){const e=$('cdn');if(!S)return;const n=Math.ceil(S.cdn);if(n!==S.cdl){S.cdl=n;if(n>0)sfx('tick',{n});else{sfx('go');sfx('bgm_start')}}if(S.cdn>0){e.style.display='flex';setH(e,`<b>${Math.ceil(S.cdn)}</b><small>속성을 골라 두세요</small>`)}else if(e.style.display!=='none'){setH(e,'<b>🐦 시작!</b>');setTimeout(()=>{e.style.display='none'},700)}}
function hud(){const me=S.pl[0];st('tm',fmt(S.t));st('gd',Math.floor(me.gold)+'G');st('ic',me.income);st('it',`(${Math.max(0,TICK-S.inc).toFixed(1)}s)`);
 st('lf',me.life);st('dm',S.dealt);}
const tierOf=c=>c>=1000?'lg':c>=500?'ep':c>=250?'rr':'cm';
function build(){T.forEach(t=>{const e=document.createElement('button');e.classList.add('tr-'+tierOf(t.c));e.innerHTML=`<i>${t.ic}</i><span>${t.race?RACE[t.race].ic:''}${t.n}</span><u>${t.c}G</u>`;
  e.onclick=()=>{if(S&&banOf(S.pl[0],t))return toast(banMsg(S.pl[0],t));sel=sel===t?null:t;view=0;insp=null;ui()};$('shB').append(e);t.el=e});
 U.forEach(u=>{const e=document.createElement('button');e.classList.add('tr-'+tierOf(u.c));e.innerHTML=`<i>${u.ic}</i><span>${u.sn||u.n}</span><u>${u.c}G</u><s>+${u.inc}</s>`;
  e.onclick=()=>{if(S&&banOf(S.pl[0],u))return toast(banMsg(S.pl[0],u));send(u);ui()};$('shU').append(e);u.el=e})}
build();
$('t1').onclick=()=>{if(S&&S.pl[0].alive)view=0;ui();$('t1').className='on';$('t2').className='';$('shB').style.display='grid';$('shU').style.display='none'};
$('t2').onclick=()=>{$('t2').className='on';$('t1').className='';$('shU').style.display='grid';$('shB').style.display='none'};
$('pz').onclick=()=>{if(S&&S.net)return toast('🌐 온라인 대전에서는 일시정지할 수 없어요');paused=!paused;$('pz').textContent=paused?'▶️':'⏸'};
$('sp').onclick=()=>{if(S&&S.net)return toast('🌐 온라인 대전에서는 배속을 바꿀 수 없어요');spd=spd===1?2:1;$('sp').textContent=spd+'x'};
$('go').onclick=()=>tryStart();$('again').onclick=()=>{$('spx').style.display='none';if(S&&S.net&&typeof NET!=='undefined'){NET.leave();return $('home').onclick()}start()};$('spec').onclick=specGo;$('spx').onclick=()=>{if(confirm('관전을 그만두고 메인 화면으로 나갈까요?'))$('home').onclick()};
$('home').onclick=()=>{if(S&&S.net&&typeof NET!=='undefined')NET.leave();$('end').style.display='none';$('spx').style.display='none';over=true;$('game').style.display='none';$('title').style.display='flex';S=null;renderTitle()};
// 🔊 짹짹 스튜디오 사운드 모듈 (SFX) — 모든 소리를 Web Audio로 실시간 합성(오리지널, 음원 파일 0개)
// 사용: SFX.play(name,args) · SFX.toggle() → true=음소거 · SFX.muted
// 규칙: 로드 시점엔 AudioContext/DOM을 건드리지 않음(헤드리스 시뮬레이션 안전). 첫 play/터치 때 지연 생성.
const SFX=(()=>{
const KEY='jjj_sfx_muted',MV=.8,BGMV=.3;
let ac=null,master=null,comp=null,sfxBus=null,bgmBus=null,noiseBuf=null,W={},offline=false,hooked=false,synced=false;
let muted=false;try{muted=localStorage.getItem(KEY)==='1'}catch(e){}
const now=()=>{try{return performance.now()}catch(e){return Date.now()}};
const P=p=>{try{if(p&&p.catch)p.catch(()=>{})}catch(e){}};
const mtof=m=>440*Math.pow(2,(m-69)/12),rnd=(a,b)=>a+Math.random()*(b-a);
const hash=s=>{let h=7;s=String(s||'');for(let i=0;i<s.length;i++)h=(h*31+s.charCodeAt(i))>>>0;return h};

// ---------- 오디오 그래프 ----------
function build(ctx){
 ac=ctx;
 comp=ac.createDynamicsCompressor();
 try{comp.threshold.value=-12;comp.knee.value=6;comp.ratio.value=12;comp.attack.value=.002;comp.release.value=.15}catch(e){}
 master=ac.createGain();master.gain.value=(muted&&!offline)?0:MV;
 sfxBus=ac.createGain();sfxBus.gain.value=1;
 bgmBus=ac.createGain();bgmBus.gain.value=BGMV;
 sfxBus.connect(comp);bgmBus.connect(comp);comp.connect(master);master.connect(ac.destination);
 // 노이즈 버퍼: 딱 한 번 만들고 모든 소리가 재사용(루프 + 랜덤 시작점)
 const n=Math.floor(ac.sampleRate);noiseBuf=ac.createBuffer(1,n,ac.sampleRate);
 const d=noiseBuf.getChannelData(0);for(let i=0;i<n;i++)d[i]=Math.random()*2-1;
 // 칩튠 펄스파(25%, 12.5%) — 고조파를 조금 덜어 말랑하게
 W={};const pw=(duty,N)=>{const re=new Float32Array(N),im=new Float32Array(N);
  for(let k=1;k<N;k++)re[k]=2*Math.sin(Math.PI*k*duty)/(Math.PI*k)*Math.pow(.93,k);
  try{return ac.createPeriodicWave(re,im)}catch(e){return null}};
 W.p25=pw(.25,28);W.p12=pw(.125,28);
}
function resume(){if(ac&&!offline&&!muted&&ac.state!=='running')P(ac.resume())}
function hook(){
 if(hooked||typeof document==='undefined'||!document.addEventListener)return;hooked=true;
 // 모바일 자동재생 정책: 실제 사용자 제스처(터치 끝/클릭)에서 resume + 1샘플 무음 재생(iOS 잠금 해제)
 const unlock=()=>{if(!ac||muted||offline||ac.state==='running')return;resume();
  try{const b=ac.createBuffer(1,1,22050),s=ac.createBufferSource();s.buffer=b;s.connect(ac.destination);s.start(0)}catch(e){}};
 ['pointerup','touchend','click','keydown'].forEach(e=>document.addEventListener(e,unlock,true));
 document.addEventListener('visibilitychange',()=>{if(!ac||offline)return;if(document.hidden)P(ac.suspend());else resume()});
}
function ensure(){
 if(ac)return ac;
 const AC=typeof AudioContext!=='undefined'?AudioContext:(typeof window!=='undefined'&&window&&(window.AudioContext||window.webkitAudioContext));
 if(!AC)return null;
 try{build(new AC({latencyHint:'interactive'}))}catch(e){try{build(new AC())}catch(e2){ac=null;return null}}
 hook();if(muted)P(ac.suspend());else resume();
 return ac;
}
function syncBtn(){if(synced)return;synced=true;try{const b=document.getElementById('snd');if(b&&muted)b.textContent='🔇'}catch(e){}}

// ---------- 합성 프리미티브 (모든 노드는 stop 시간 지정 → 자동 해제) ----------
function env(g,t,v,a,h,d){v=Math.max(v,.0002);g.gain.value=0;g.gain.setValueAtTime(.0001,t);g.gain.linearRampToValueAtTime(v,t+a);
 if(h)g.gain.setValueAtTime(v,t+a+h);g.gain.exponentialRampToValueAtTime(.0001,t+Math.max(d,a+(h||0)+.01))}
function sweep(p,t,o,def){p.setValueAtTime(o.f||def,t);
 if(o.pts)o.pts.forEach(q=>p.exponentialRampToValueAtTime(Math.max(20,q[1]),t+q[0]));
 else if(o.f2)p.exponentialRampToValueAtTime(Math.max(20,o.f2),t+(o.gl||o.dur))}
// o: f,f2,gl,pts,type|wave,dur,v,a,hold,lp(+ft,q),vib,vibF,det,bus
function tone(t,o){
 const os=ac.createOscillator(),g=ac.createGain(),end=t+o.dur+.03;
 if(o.wave&&W[o.wave])os.setPeriodicWave(W[o.wave]);else os.type=o.type||'triangle';
 sweep(os.frequency,t,o,440);if(o.det)os.detune.value=o.det;
 let out=os,fl=null;
 if(o.lp){fl=ac.createBiquadFilter();fl.type=o.ft||'lowpass';fl.frequency.value=o.lp;fl.Q.value=o.q||.7;os.connect(fl);out=fl}
 out.connect(g);g.connect(o.bus||sfxBus);env(g,t,o.v,o.a||.005,o.hold,o.dur);
 if(o.vib){const l=ac.createOscillator(),lg=ac.createGain();l.frequency.value=o.vibF||6;lg.gain.value=o.vib;l.connect(lg);lg.connect(os.frequency);l.start(t);l.stop(end)}
 os.onended=()=>{try{g.disconnect();if(fl)fl.disconnect()}catch(e){}};
 os.start(t);os.stop(end);return os;
}
// o: ft,f,f2,gl,pts,q,dur,v,a,hold,am(트레몰로 Hz),rate,bus
function noise(t,o){
 const s=ac.createBufferSource(),fl=ac.createBiquadFilter(),g=ac.createGain(),end=t+o.dur+.03;
 s.buffer=noiseBuf;s.loop=true;if(o.rate)s.playbackRate.value=o.rate;
 fl.type=o.ft||'bandpass';sweep(fl.frequency,t,o,1000);fl.Q.value=o.q||1;
 s.connect(fl);let out=fl;
 if(o.am){const gt=ac.createGain(),l=ac.createOscillator(),lg=ac.createGain();gt.gain.value=.5;l.type='square';l.frequency.value=o.am;lg.gain.value=.5;
  l.connect(lg);lg.connect(gt.gain);fl.connect(gt);out=gt;l.start(t);l.stop(end)}
 out.connect(g);g.connect(o.bus||sfxBus);env(g,t,o.v,o.a||.003,o.hold,o.dur);
 s.onended=()=>{try{g.disconnect();fl.disconnect()}catch(e){}};
 s.start(t,Math.random()*.8);s.stop(end);return s;
}
const arp=(t,ms,step,o)=>ms.forEach((m,i)=>tone(t+i*step,Object.assign({},o,{f:mtof(m)})));
const bubbles=(t,n,span,v,lo,hi)=>{for(let i=0;i<n;i++){const f=rnd(lo||180,hi||420);tone(t+rnd(0,span),{type:'sine',f,f2:f*2,dur:.06,v:v*rnd(.6,1)})}};
const crackles=(t,n,span,v)=>{for(let i=0;i<n;i++)noise(t+rnd(0,span),{ft:'highpass',f:rnd(3500,6500),dur:.018,v:v*rnd(.5,1)})};

// ---------- 스로틀 ----------
let last={},wins={};
// 🔊 Kenney 효과음(CC0, assets/sfx): 녹음된 소리를 먼저 쓰고, 아직 못 불러왔거나 실패하면 기존 합성음으로 대신해요
const SMP={tap:['click_001','click_002','click_003'],build:['impactWood_medium_000','impactWood_medium_001'],upgrade:['maximize_006'],sell:['handleCoins','handleCoins2'],
 send:['drop_002','drop_003'],tech:['jingles_NES03'],unlock:['jingles_NES12'],skill:['maximize_009'],die:['impactSoft_medium_000','impactSoft_medium_001','impactSoft_medium_002'],
 leak:['impactPunch_heavy_000','impactPunch_heavy_001'],elim:['impactBell_heavy_000'],alarm:['impactBell_heavy_001'],win:['jingles_STEEL02'],lose:['jingles_STEEL06'],start:['jingles_NES08'],go:['jingles_NES05'],
 tick:['tick_001'],hatch:['impactGlass_light_000','impactGlass_light_001'],lay:['drop_004'],pop:['glass_001','glass_002'],revive:['maximize_003']};
const SVOL={tap:.3,die:.28,send:.4,build:.5,tick:.4,hatch:.4,pop:.35,lay:.35},SGAP={tap:60,die:70,hatch:120,pop:90,leak:120,send:80},SLAYER={die:1};// SLAYER: 녹음 소리 + 기존 새 울음 합성음을 같이
const SBUF={};let sLoad=false;
function smpLoad(){if(sLoad||!ac||offline)return;sLoad=true;[...new Set(Object.values(SMP).flat())].forEach(f=>fetch('assets/sfx/'+f+'.ogg').then(r=>r.ok?r.arrayBuffer():Promise.reject()).then(b=>new Promise((ok,no)=>ac.decodeAudioData(b,ok,no))).then(buf=>{SBUF[f]=buf}).catch(()=>{}))}
function smpPlay(n,t){const L=SMP[n];if(!L||offline)return false;const f=L[Math.floor(Math.random()*L.length)],buf=SBUF[f];if(!buf)return false;if(!gate('smp_'+n,SGAP[n]||40))return !SLAYER[n];
 const s=ac.createBufferSource();s.buffer=buf;s.playbackRate.value=.94+Math.random()*.12;const g=ac.createGain();g.gain.value=SVOL[n]||.55;s.connect(g);g.connect(sfxBus||master);s.start(t);return !SLAYER[n]}
const gate=(k,ms)=>{const n=now();if(last[k]&&n-last[k]<ms)return false;last[k]=n;return true};
const rate=(k,max)=>{const n=now(),a=wins[k]||(wins[k]=[]);while(a.length&&n-a[0]>1000)a.shift();if(a.length>=max)return false;a.push(n);return true};

// ---------- 속성별 발사음 ----------
const EL={
 fire(t,v,p){noise(t,{ft:'lowpass',f:450*p,f2:2400*p,gl:.07,dur:.22,a:.02,v:v*1.3,q:.8});crackles(t+.03,2,.12,v*.6)},           // 화르륵
 ice(t,v,p){const f=1760*p*rnd(.98,1.03);tone(t,{type:'sine',f,dur:.2,v:v*.8});tone(t,{type:'sine',f:f*2.76,dur:.11,v:v*.35});
  noise(t,{ft:'highpass',f:6500,dur:.03,v:v*.6})},                                                                           // 챙
 thunder(t,v,p){noise(t,{ft:'bandpass',f:2400*p,q:1.2,dur:.16,v:v*2.4,am:rnd(36,58)});tone(t,{type:'square',f:120*p,f2:55,dur:.12,v:v*.3,lp:900})}, // 찌직
 wind(t,v,p){noise(t,{ft:'bandpass',q:4,f:450*p,pts:[[.12,1400*p],[.28,650*p]],dur:.3,a:.06,v:v*3.5})},                         // 휘잉
 dark(t,v,p){for(let i=0;i<3;i++){const f=rnd(260,340)*p*(1+i*.2);tone(t+i*.055,{type:'sine',f,f2:f*1.9,dur:.05,v:v*.6,a:.004})}} // 보글
};
const BASE={
 egg(t,v){tone(t,{type:'sine',f:340,f2:110,dur:.13,v:v*1.1});noise(t,{ft:'highpass',f:3000,dur:.015,v:v*.4})},                // 새총 퉁
 air(t,v){noise(t,{ft:'bandpass',q:2,f:2500,f2:6500,dur:.1,a:.01,v:v*2.5});tone(t,{type:'triangle',f:1800,f2:2600,dur:.05,v:v*.2})}, // 깃털 슉
 acorn(t,v){tone(t,{type:'sine',f:170,f2:45,dur:.2,v:v*1.5});noise(t,{ft:'lowpass',f:500,dur:.1,v:v})},                       // 도토리 쿵
 bat(t,v){tone(t,{type:'triangle',f:2600,f2:3300,dur:.06,v:v*.5});EL.dark(t+.04,v*.7,1.2)},                                   // 박쥐 끽+보글
 snack(t,v){for(let i=0;i<5;i++)noise(t+i*.045+rnd(0,.015),{ft:'bandpass',f:rnd(3500,6000),q:2,dur:.035,v:v*1.5});           // 사락사락 뿌리기
  [0,.08,.16].forEach(d=>tone(t+.1+d,{type:'sine',f:rnd(1800,2400),dur:.04,v:v*.4}))},                                         //  + 톡톡 떨어지는 과자
 pylon(t,v){noise(t,{ft:'bandpass',f:3200,q:1.5,dur:.07,v:v*1.6,am:60});tone(t,{type:'square',f:100,dur:.06,v:v*.2,lp:700})},  // 전봇대 찌릿
 net(t,v){noise(t,{ft:'bandpass',q:3,f:900,f2:3500,dur:.13,a:.04,v:v*1.8});                                                   // 휙-
  noise(t+.13,{ft:'lowpass',f:2200,f2:600,dur:.09,v:v*1.4});tone(t+.13,{type:'triangle',f:420,f2:240,dur:.07,v:v*.5})}          // 철썩
};
const EXTRA={sun:(t,v)=>tone(t,{type:'triangle',f:1500,f2:700,dur:.16,v}),lava:(t,v)=>tone(t,{type:'sine',f:130,f2:40,dur:.18,v:v*1.4}),
 storm:(t,v)=>noise(t+.08,{ft:'bandpass',f:1800,q:1,dur:.12,v,am:44}),bliz:(t,v)=>EL.wind(t,v*.6,1.3),twister:(t,v)=>tone(t,{type:'triangle',f:900,f2:1600,dur:.08,v:v*.4})};
function tdef(id){try{return typeof TB!=='undefined'?TB[id]:null}catch(e){return null}}
function tier(b){try{const i=TECH[b.tech].t.indexOf(b.id);return [1.1,.9,.75][i]||1}catch(e){return 1}}
function shootSnd(t,id,v){
 const b=tdef(id);
 if(BASE[id])return BASE[id](t,v);
 if(b&&b.combo&&EL[b.combo[0]]&&EL[b.combo[1]]){EL[b.combo[0]](t,v*.7,1);EL[b.combo[1]](t+.03,v*.7,1.05);return}
 if(b&&b.tech&&EL[b.tech]){EL[b.tech](t,v,tier(b));if(EXTRA[id])EXTRA[id](t,v*.6);return}
 BASE.egg(t,v);
}

// ---------- 새 울음(크기·체력 → 음높이) ----------
function udef(id){try{return typeof UB!=='undefined'?UB[id]:null}catch(e){return null}}
function usize(u){const hp=(u&&u.hp)||300;return Math.max(.75,Math.min(3.2,Math.pow(hp/300,.3)))}
function chirp(t,id,v){
 const u=udef(id),sz=usize(u),h=hash(id),f0=1400/sz*(1+((h%7)-3)*.035)*rnd(.97,1.03);
 if(sz<1.5){ // 삐약 (작은 새)
  tone(t,{wave:'p25',f:f0*.9,f2:f0*1.25,dur:.055,v:v*.7,lp:4500});
  tone(t+.065,{type:'triangle',f:f0*1.3,f2:f0*.75,gl:.12,dur:.14,v,vib:f0*.04,vibF:26});
 }else{ // 꽥 (큰 새) — 비음 포먼트
  tone(t,{type:'sawtooth',f:f0*.8,f2:f0*.55,dur:.2,v:v*2.6,lp:Math.min(2600,f0*2.5),ft:'bandpass',q:2.2,vib:f0*.05,vibF:22});
  tone(t,{type:'square',f:f0*.4,f2:f0*.28,dur:.18,v:v*.5,lp:900});
 }
 if(u&&u.t==='A')noise(t+.02,{ft:'bandpass',f:3000,dur:.08,v:v*.4}); // 깃털 퍼덕
}

// ---------- 조합 스킬 10종 ----------
const SK={
 steam(t,v){noise(t,{ft:'highpass',f:2500,dur:1.4,a:.12,hold:.6,v:v*.3});
  tone(t+.15,{type:'sine',f:1650,f2:1900,gl:.6,dur:1.1,a:.25,hold:.4,v:v*.12,vib:35,vibF:7});bubbles(t+.1,9,1,v*.25,150,300)},
 plasma(t,v){tone(t,{type:'sawtooth',f:90,f2:800,gl:.55,dur:.62,a:.05,hold:.4,v:v*.22,lp:1600});noise(t,{ft:'bandpass',f:3000,q:1,dur:.6,a:.05,hold:.3,v:v*.3,am:52});
  tone(t+.58,{type:'sine',f:130,f2:32,dur:.7,v:v*.7});noise(t+.58,{ft:'lowpass',f:1200,f2:120,dur:.8,v:v*.5});arp(t+.6,[72,79,84],.07,{wave:'p25',dur:.25,v:v*.12,lp:3000})},
 firestorm(t,v){noise(t,{ft:'lowpass',f:400,pts:[[.5,1800],[1.4,500]],dur:1.5,a:.2,hold:.6,v:v*.45});
  noise(t,{ft:'bandpass',q:6,f:400,pts:[[.35,1700],[.7,500],[1.05,1900],[1.45,600]],dur:1.5,a:.15,hold:.7,v:v*.6});crackles(t+.1,12,1.2,v*.35)},
 pyre(t,v){tone(t,{type:'sawtooth',f:55,dur:1.4,a:.15,hold:.7,v:v*.25,lp:320,vib:3,vibF:4});bubbles(t,16,1.2,v*.3,120,320);
  noise(t+.1,{ft:'highpass',f:5000,dur:1.2,a:.2,hold:.5,v:v*.12});arp(t+.15,[57,60,63,69],.18,{wave:'p25',dur:.3,v:v*.12,lp:1800})},
 aurora(t,v){[72,76,79].forEach(m=>tone(t,{type:'sine',f:mtof(m),dur:1.6,a:.35,hold:.6,v:v*.07}));
  [84,88,91,96,93,98,100,103].forEach((m,i)=>{const f=mtof(m);tone(t+.08+i*.1,{type:'sine',f,dur:.5,v:v*.1});tone(t+.08+i*.1,{type:'sine',f:f*2.76,dur:.18,v:v*.03})});
  noise(t+.35,{ft:'bandpass',f:2600,q:1.3,dur:.14,v:v*.25,am:48});noise(t+.75,{ft:'bandpass',f:2900,q:1.3,dur:.12,v:v*.22,am:55})},
 whiteout(t,v){noise(t,{ft:'bandpass',q:8,f:300,pts:[[.45,900],[.9,420],[1.5,1100]],dur:1.6,a:.2,hold:.8,v:v*1.1});
  noise(t+.1,{ft:'bandpass',q:8,f:600,pts:[[.5,1300],[1,700],[1.5,1500]],dur:1.5,a:.2,hold:.7,v:v*.7});
  for(let i=0;i<7;i++){const f=rnd(2200,3600);tone(t+.2+rnd(0,1.1),{type:'sine',f,dur:.18,v:v*.08})}},
 frostbane(t,v){[96,95,91,90,86,85].forEach((m,i)=>{const f=mtof(m);tone(t+i*.1,{type:'sine',f,dur:.3,v:v*.11});tone(t+i*.1,{type:'sine',f:f*2.76,dur:.1,v:v*.04})});
  crackles(t,6,.7,v*.4);tone(t+.1,{type:'sine',f:70,dur:1.3,a:.2,hold:.5,v:v*.3,vib:4,vibF:5});bubbles(t+.5,7,.8,v*.25,160,280)},
 tempest(t,v){noise(t,{ft:'bandpass',f:2600,q:1.2,dur:.15,v:v*.45,am:60});noise(t+.12,{ft:'lowpass',f:3000,f2:180,gl:1,dur:1.3,v:v*.8});
  tone(t+.12,{type:'sine',f:70,f2:28,dur:1.1,v:v*.55});noise(t+.3,{ft:'bandpass',q:5,f:500,pts:[[.5,1500],[1.2,600]],dur:1.2,a:.2,v:v*.6})},
 venomvolt(t,v){const os=ac.createOscillator(),fl=ac.createBiquadFilter(),g=ac.createGain(),l=ac.createOscillator(),lg=ac.createGain(),end=t+1.45;
  os.type='sawtooth';os.frequency.value=72;fl.type='bandpass';fl.Q.value=4;fl.frequency.value=1000;l.frequency.setValueAtTime(5,t);l.frequency.linearRampToValueAtTime(11,t+1.3);lg.gain.value=750;
  l.connect(lg);lg.connect(fl.frequency);os.connect(fl);fl.connect(g);g.connect(sfxBus);env(g,t,v*.45,.08,.8,1.4);
  os.onended=()=>{try{g.disconnect();fl.disconnect()}catch(e){}};os.start(t);os.stop(end);l.start(t);l.stop(end);
  noise(t+.2,{ft:'bandpass',f:2800,q:1.4,dur:.9,a:.05,hold:.4,v:v*.22,am:47});bubbles(t+.3,8,1,v*.25,200,380)},
 miasma(t,v){noise(t,{ft:'lowpass',f:280,pts:[[.6,900],[1.6,250]],dur:1.7,a:.3,hold:.6,v:v*.6});
  [0,.35,.7].forEach(d=>noise(t+d,{ft:'bandpass',f:700,f2:300,q:1.5,dur:.3,a:.04,v:v*.35}));arp(t+.2,[64,63,60,59,55],.2,{type:'triangle',dur:.35,v:v*.12})}
};
const SKC={steam:['fire','ice'],plasma:['fire','thunder'],firestorm:['fire','wind'],pyre:['fire','dark'],aurora:['ice','thunder'],whiteout:['ice','wind'],
 frostbane:['ice','dark'],tempest:['thunder','wind'],venomvolt:['thunder','dark'],miasma:['wind','dark']};

// ---------- 속성 습득 아르페지오 ----------
const TECHARP={fire:[60,64,67,72,76],ice:[72,79,84,88,91],thunder:[62,66,69,74,78],wind:[65,69,72,77,81],dark:[57,60,63,66,69]};

// ---------- 효과음 표 ----------
const FX={
 tap(t){if(!gate('tap',45))return;tone(t,{type:'triangle',f:1300,f2:1750,dur:.045,v:.07})},
 start(t){arp(t,[60,64,67,72,76,79],.06,{wave:'p25',dur:.14,v:.09,lp:3500});noise(t+.3,{ft:'highpass',f:6000,dur:.25,v:.05})},
 tick(t,a){const n=Math.max(1,Math.min(5,a.n|0||1)),m=79+(5-n);
  tone(t,{wave:'p25',f:mtof(m),dur:.14,hold:.05,v:n===1?.13:.1,lp:4000});tone(t,{type:'sine',f:mtof(m-12),dur:.12,v:.06})},
 go(t){noise(t,{ft:'bandpass',f:1300,q:.7,dur:.13,v:.4});tone(t,{type:'sine',f:180,f2:50,dur:.16,v:.4});
  [72,76,79,84].forEach((m,i)=>tone(t+.05+i*.035,{wave:'p25',f:mtof(m),dur:.5,hold:.15,v:.065,lp:3600}));
  tone(t+.2,{type:'triangle',f:mtof(88),dur:.45,hold:.1,v:.1,vib:12,vibF:7});crackles(t+.25,5,.3,.06)},
 send(t,a){if(!gate('send',60))return;const u=udef(a.unit),sz=usize(u),f=620/sz;
  tone(t,{type:'triangle',f,f2:f*2.3,dur:.15,v:.13});noise(t+.06,{ft:'bandpass',f:1800,dur:.04,v:.07});noise(t+.12,{ft:'bandpass',f:1600,dur:.04,v:.06});
  if(u&&(u.combo||u.c>=900))arp(t+.12,[84,88,91],.05,{type:'sine',dur:.15,v:.05})},
 build(t,a){if(!gate('build',70))return;const b=tdef(a.tower),w=a.tower==='wall',k=w?.7:1;
  tone(t,{type:'triangle',f:260*k,f2:180*k,dur:.07,v:.17});noise(t,{ft:'lowpass',f:2500,dur:.03,v:.12});
  tone(t+.09,{type:'triangle',f:390*k,f2:270*k,dur:.07,v:.17});noise(t+.09,{ft:'lowpass',f:2500,dur:.03,v:.12});
  if(!w)tone(t+.18,{type:'sine',f:1046,dur:.22,v:.07});
  if(b&&(b.tech||b.combo))shootSnd(t+.2,a.tower,.06)},
 upgrade(t,a){if(!gate('upg',60))return;const r=72+Math.min(8,((a.lv|0)||2)-1)*2;
  arp(t,[r,r+4,r+7,r+12],.06,{wave:'p25',dur:.16,v:.08,lp:4000});tone(t+.24,{type:'sine',f:mtof(r+24),dur:.3,v:.05})},
 sell(t){if(!gate('sell',60))return;arp(t,[79,76,84],.055,{type:'triangle',dur:.12,v:.12});
  tone(t+.17,{type:'sine',f:2093,dur:.25,v:.05});tone(t+.17,{type:'sine',f:2637,dur:.22,v:.04});noise(t+.17,{ft:'highpass',f:7000,dur:.18,v:.04})},
 tech(t,a){const ms=TECHARP[a.k]||TECHARP.fire;noise(t,{ft:'highpass',f:500,f2:6000,dur:.35,a:.3,v:.08});
  arp(t+.05,ms,.07,{wave:'p25',dur:.22,v:.08,lp:3800});if(EL[a.k])EL[a.k](t+.42,.12,1);
  if(a.combo){const t2=t+.5;[ms[0],ms[2],ms[3]].forEach(m=>tone(t2,{wave:'p25',f:mtof(m+12),dur:.7,hold:.25,v:.055,lp:3000}));
   tone(t2,{type:'triangle',f:mtof(ms[0]-12),dur:.7,hold:.25,v:.15});crackles(t2,6,.5,.05)}},
 shoot(t,a){const id=a.tower||'egg';if(!gate('sh_'+id,80)||!gate('sh_any',30)||!rate('shoot',10))return;shootSnd(t,id,.06)},
 die(t,a){const id=a.unit||'chick';if(!gate('die_'+id,70)||!gate('die_any',40)||!rate('die',8))return;chirp(t,id,.09)},
 revive(t){if(!gate('rev',300))return;noise(t,{ft:'bandpass',q:2,f:300,f2:3000,dur:.6,a:.2,v:.25});
  arp(t+.05,[67,71,74,79,83,86],.055,{wave:'p25',dur:.16,v:.08,lp:4000});tone(t+.4,{type:'sine',f:mtof(91),dur:.45,v:.06,vib:20,vibF:8})},
 leak(t,a){if(!gate('leak',150))return;const dm=Math.max(1,+a.dm||1),v=Math.min(1,.65+dm*.06);
  tone(t,{type:'triangle',f:900,f2:300,dur:.22,v:.18*v});tone(t,{type:'square',f:200,f2:90,dur:.16,v:.07*v,lp:700});
  if(dm>=3)tone(t+.13,{type:'triangle',f:700,f2:220,dur:.22,v:.15*v});if(dm>=6)tone(t+.26,{type:'triangle',f:520,f2:160,dur:.25,v:.13*v})},
 skill(t,a){if(!gate('sk_'+a.id,400))return;const v=a.mine?1:.55,c=SKC[a.id];
  noise(t,{ft:'highpass',f:400,f2:6000,dur:.35,a:.25,v:.12*v});
  if(SK[a.id])SK[a.id](t+.2,v);else if(c){EL[c[0]](t+.2,.25*v,1);EL[c[1]](t+.3,.25*v,1)}},
 alarm(t,a){const m=a.mul>=3?3:2,n=m===3?6:4,d=m===3?.12:.16,hi=m===3?mtof(83):mtof(81),lo=m===3?mtof(78):mtof(76);
  for(let i=0;i<n;i++)tone(t+i*d,{wave:'p25',f:i%2?lo:hi,dur:d*.95,hold:d*.5,v:.1,lp:2800});
  tone(t,{type:'triangle',f:mtof(m===3?40:43),dur:n*d,hold:n*d*.6,v:.2})},
 elim(t){if(!gate('elim',250))return;noise(t,{ft:'lowpass',f:2000,f2:300,dur:.25,v:.25});
  tone(t+.05,{type:'sine',f:1600,f2:260,gl:.55,dur:.6,hold:.25,v:.09});tone(t+.55,{type:'sine',f:110,f2:60,dur:.2,v:.25})},
 win(t){const e=.17;
  [[0,72,1],[1,76,1],[2,79,1],[3,84,2],[5,81,1],[6,83,1],[7,84,1],[8,86,1],[9,88,5]].forEach(([s,m,l])=>tone(t+s*e,{wave:'p25',f:mtof(m),dur:l*e*.95,hold:l*e*.5,v:.1,lp:3800,vib:l>2?mtof(m)*.012:0,vibF:6}));
  [[0,48,2],[2,55,2],[4,53,2],[6,55,2],[9,48,5]].forEach(([s,m,l])=>tone(t+s*e,{type:'triangle',f:mtof(m),dur:l*e*.95,hold:l*e*.5,v:.22}));
  [76,79,84].forEach(m=>tone(t+9*e,{wave:'p12',f:mtof(m),dur:5*e,hold:2*e,v:.04,lp:3000}));
  arp(t+9*e,[96,100,103,108,103,108],e/2,{type:'triangle',dur:.12,v:.04});noise(t+9*e,{ft:'highpass',f:6000,dur:.6,v:.05});
  [0,4,8,9].forEach(s=>tone(t+s*e,{type:'sine',f:150,f2:45,dur:.12,v:.25}))},
 // ---- 스프린트 2: 과자·전깃줄 ----
 pop(t){if(!gate('pop',90)||!rate('pop',6))return;tone(t,{type:'sine',f:500,f2:1500,dur:.07,v:.14});noise(t+.02,{ft:'highpass',f:5000,dur:.04,v:.08})},
 eat(t){if(!gate('eat',110)||!rate('eat',5))return; // 바삭! 오독오독 + 냠
  noise(t,{ft:'highpass',f:3000,dur:.03,v:.16});tone(t,{type:'triangle',f:900,f2:500,dur:.03,v:.05});
  [.07,.13,.19].forEach((d,i)=>noise(t+d+rnd(0,.01),{ft:'bandpass',f:rnd(2000,3200),q:2.5,dur:.025,v:.11-i*.02}));
  tone(t+.24,{type:'sine',f:rnd(1150,1350),f2:1700,dur:.07,v:.045})},
 wire(t,a){if(!gate('wire',250)||!rate('wire',4))return;const m=Math.max(1,Math.min(3,+a.mult||1)),d=.1+m*.06; // 지지직: mult↑ = 굵고 길고 셈
  noise(t,{ft:'bandpass',f:3200-m*600,q:1.1,dur:d,hold:d*.4,v:.05+m*.03,am:42+m*9});
  tone(t,{type:'sawtooth',f:mtof(30+m*2),dur:d,hold:d*.4,v:.03+m*.025,lp:500+m*400});
  if(m>=2)noise(t+d*.5,{ft:'highpass',f:5000,dur:.04,v:.05*m});if(m>=3)tone(t+.02,{type:'square',f:60,f2:40,dur:d,v:.06,lp:400})},
 // ---- 수상한 알 연구소 ----
 hatch(t,a){const to=String(a.to||'hatch_chick'),k=to.replace(/^hatch_/,'');if(!gate('hatch_'+k,90)||!rate('hatch',6))return;
  // 껍데기 "빠직!" — 짧은 클릭 3번 + 마른 톡
  [0,.035,.075].forEach((d,i)=>noise(t+d,{ft:'highpass',f:2500+i*900,dur:.022,v:.16}));tone(t,{type:'triangle',f:1400,f2:700,dur:.05,v:.07});
  const c=t+.13;
  if(k==='dino'){ // 작은 포효(귀엽게 으르렁)
   tone(c,{type:'sawtooth',f:150,pts:[[.12,230],[.42,95]],dur:.45,a:.04,v:.16,lp:900,ft:'bandpass',q:1.6,vib:18,vibF:24});
   noise(c,{ft:'lowpass',f:600,f2:250,dur:.4,a:.05,v:.12});tone(c,{type:'sine',f:90,f2:55,dur:.3,v:.15})}
  else{tone(c,{wave:'p25',f:1500,f2:1900,dur:.05,v:.06,lp:4500});tone(c+.06,{type:'triangle',f:2000,f2:1250,gl:.1,dur:.12,v:.09,vib:60,vibF:26})}
  if(k==='gold'){arp(c+.12,[88,91,96,100],.05,{type:'sine',dur:.3,v:.06});noise(c+.12,{ft:'highpass',f:7000,dur:.4,v:.05})}
  else if(EL[k])EL[k](c+.18,.05,1.1)},
 lay(t){if(!gate('lay',120)||!rate('lay',5))return;const f=rnd(470,560);
  tone(t,{type:'sine',f,f2:f*1.8,dur:.09,v:.14});tone(t+.07,{type:'triangle',f:f*2.4,dur:.07,v:.04})},
 unlock(t,a){if(!gate('unl',600))return;const k=a.k,big=k==='chief'||k==='dino',e=big?.16:.13,R={hatch:0,twin:2,gold:5,chief:-3,dino:-5}[k]||0;
  noise(t,{ft:'highpass',f:500,f2:7000,dur:.4,a:.3,v:.09});
  const L=[[0,72],[1,76],[2,79],[3,84],[4,79],[5,84],[6,88],[7,91]];
  L.forEach(([s,m])=>tone(t+.3+s*e,{wave:'p25',f:mtof(m+R),dur:e*1.4,hold:e*.5,v:.085,lp:4000}));
  const z=t+.3+8*e,hold=big?1.1:.75;
  [72,76,79,84].forEach(m=>tone(z,{wave:'p25',f:mtof(m+R+12),dur:hold,hold:hold*.4,v:.05,lp:3500,vib:5,vibF:6}));
  tone(z,{type:'triangle',f:mtof(48+R),dur:hold,hold:hold*.4,v:.24});arp(z,[96,100,103,108].map(m=>m+R),.06,{type:'sine',dur:.25,v:.04});
  noise(z,{ft:'highpass',f:6500,dur:.5,v:.06});
  if(big){ // 웅장하게: 팀파니 롤 + 저음 + 화음 한 겹 더
   for(let i=0;i<8;i++)tone(t+.3+i*e,{type:'sine',f:mtof(36+R)*(i%2?1.5:1),f2:mtof(36+R)*.8,dur:.18,v:.18+i*.015});
   tone(z,{type:'sine',f:mtof(36+R),f2:mtof(36+R)*.9,dur:hold,v:.3});
   [67,71,74].forEach(m=>tone(z,{type:'sawtooth',f:mtof(m+R),dur:hold,a:.06,hold:hold*.4,v:.03,lp:1500}));
   if(k==='dino')tone(z+.05,{type:'sawtooth',f:140,pts:[[.15,220],[.6,80]],dur:.65,a:.05,v:.12,lp:900,ft:'bandpass',q:1.5,vib:15,vibF:22})}},
 lose(t){const e=.24;
  [[0,76,2],[2,75,2],[4,72,2],[6,71,2],[8,67,4]].forEach(([s,m,l])=>tone(t+s*e,{type:'triangle',f:mtof(m),dur:l*e*.95,hold:l*e*.45,v:.14,vib:l>2?mtof(m)*.015:0,vibF:4.5}));
  [[0,48,4],[4,44,4],[8,43,4]].forEach(([s,m,l])=>tone(t+s*e,{type:'triangle',f:mtof(m),dur:l*e*.95,hold:l*e*.4,v:.2}));
  [[0,[60,63]],[4,[56,60]],[8,[55,59,62]]].forEach(([s,ms])=>ms.forEach(m=>tone(t+s*e,{wave:'p12',f:mtof(m),dur:4*e,hold:e,v:.03,lp:1800})))}
};

// ---------- BGM: 8마디 오리지널 칩튠 루프 (16분음표 스텝 128개) ----------
// 멜로디(8분음표 토큰): 숫자=MIDI 음, '-'=늘임, '.'=쉼
const MEL=(()=>{const out=[];let lst=null;
 ('76 79 - 84 83 79 76 - | 74 76 79 . 83 - 81 79 | 81 . 84 81 76 . 79 81 | 77 - 81 - 79 77 76 74 | '+
  '76 79 . 84 86 84 79 . | 83 - 86 83 79 - 81 83 | 84 - 81 77 81 - 84 86 | 83 - 79 - 74 - . .')
 .split('|').forEach(bar=>bar.trim().split(/\s+/).forEach(k=>{if(k==='-'){if(lst)lst.len++;out.push(null)}else if(k==='.'){lst=null;out.push(null)}else{lst={m:+k,len:1};out.push(lst)}}));return out})();
const BASS=[48,52,45,41,48,43,41,43];
const CH=[[60,64,67],[59,64,67],[57,60,64],[57,60,65],[60,64,67],[59,62,67],[57,60,65],[59,62,67]];
const BPM={1:126,2:146,3:166},TRN={1:0,2:0,3:2};
const BG={on:false,tm:null,step:0,next:0,mul:1,tr:0};
function kick(t,v){tone(t,{type:'sine',f:150,f2:45,dur:.13,v,bus:bgmBus})}
function snare(t,v){noise(t,{ft:'bandpass',f:1800,q:.8,dur:.1,v,bus:bgmBus});tone(t,{type:'triangle',f:230,f2:160,dur:.06,v:v*.5,bus:bgmBus})}
function hat(t,v){noise(t,{ft:'highpass',f:7000,dur:.03,v,bus:bgmBus})}
function bgmStep(i,t,d){
 const bar=i>>4,s=i&15,m=BG.mul,tr=BG.tr;
 if(s===0||s===8||(m>=3&&s===10)||(m>=2&&s===14&&bar%2))kick(t,.32);
 if(s===4||s===12)snare(t,.16);
 if(m>=2||s%2===0)hat(t,s%4===2?.05:.028);
 if(m>=3||s%2===0){const r=BASS[bar]+tr+((m>=3?s:s>>1)%2?12:0);tone(t,{type:'triangle',f:mtof(r),dur:d*(m>=3?.95:1.8),v:.22,bus:bgmBus})}
 if(m>=2||s%2===0){const c=CH[bar];tone(t,{wave:'p12',f:mtof(c[(m>=2?s:s>>1)%3]+12+tr),dur:d*.9,v:.03,lp:3000,bus:bgmBus})}
 if(s%2===0){const e=MEL[bar*8+(s>>1)];if(e){const L=e.len*2*d,f=mtof(e.m+tr);
  tone(t,{wave:'p25',f,dur:L*.95,hold:L*.45,v:.085,lp:2600,vib:e.len>1?f*.01:0,vibF:5.5,bus:bgmBus});
  if(m>=3)tone(t,{wave:'p12',f:f*2,dur:L*.9,hold:L*.3,v:.025,lp:4000,bus:bgmBus})}}
}
function bgmFill(until){let g=0;
 while(BG.next<until&&g++<64){const d=60/BPM[BG.mul]/4;if((BG.step&15)===0)BG.tr=TRN[BG.mul];
  if(!muted||offline)bgmStep(BG.step,BG.next,d);BG.next+=d;BG.step=(BG.step+1)%128}}
function bgmTick(){if(!ac||!BG.on)return;try{const ct=ac.currentTime;if(BG.next<ct)BG.next=ct+.05;
 let pz=false;try{pz=typeof paused!=='undefined'&&!!paused}catch(e){}
 const tg=pz?BGMV*.3:BGMV;if(Math.abs(bgmBus.gain.value-tg)>.01)bgmBus.gain.setTargetAtTime(tg,ct,.1);
 bgmFill(ct+.15)}catch(e){}}
function bgmStart(){bgmStop(true);BG.on=true;BG.step=0;BG.mul=1;BG.tr=0;const ct=ac.currentTime;
 bgmBus.gain.cancelScheduledValues(ct);bgmBus.gain.setValueAtTime(BGMV,ct);BG.next=ct+.1;
 if(!offline&&typeof setInterval!=='undefined')BG.tm=setInterval(bgmTick,30)}
function bgmStop(quick){BG.on=false;if(BG.tm){clearInterval(BG.tm);BG.tm=null}
 if(ac&&bgmBus&&!quick){const ct=ac.currentTime;bgmBus.gain.cancelScheduledValues(ct);bgmBus.gain.setValueAtTime(bgmBus.gain.value,ct);bgmBus.gain.linearRampToValueAtTime(0,ct+.25)}}

// 사용자 제스처 없이 suspended 상태일 때도 예약해 둘 '중요한' 소리(재개 시 몰려 터지는 걸 막기 위해 잦은 소리는 제외)
const KEEP={start:1,go:1,win:1,lose:1,tech:1,skill:1,alarm:1};
return {
 play(n,a){try{a=a||{};
  if(n==='bgm_stop'){bgmStop();return}
  if(n==='alarm')BG.mul=a.mul>=3?3:a.mul>=2?2:1;
  if(n!=='bgm_start'&&!FX[n])return;
  if(!ensure())return;syncBtn();
  if(n==='bgm_start'){bgmStart();return}
  if(muted&&!offline)return;
  if(!offline&&ac.state!=='running'){resume();if(!KEEP[n])return}
  smpLoad();if(!smpPlay(n,ac.currentTime+.01))FX[n](ac.currentTime+.01,a);
 }catch(e){}},
 toggle(){muted=!muted;try{localStorage.setItem(KEY,muted?'1':'0')}catch(e){}
  try{if(ac&&!offline){const ct=ac.currentTime;master.gain.cancelScheduledValues(ct);master.gain.setValueAtTime(master.gain.value,ct);
   master.gain.linearRampToValueAtTime(muted?0:MV,ct+.06);
   if(muted)setTimeout(()=>{if(muted&&ac)P(ac.suspend())},120);else resume()}else if(!muted)ensure()}catch(e){}
  return muted},
 get muted(){return muted},
 // 테스트용: OfflineAudioContext에 그래프를 붙여 렌더링(null이면 원상복구)
 _attach(ctx){bgmStop(true);last={};wins={};if(!ctx){ac=null;offline=false;return}offline=true;build(ctx)},
 _bgm(sec,mul){bgmStart();BG.mul=mul||1;bgmFill(sec)},
 _mel:MEL
};
})();

// 🎨 아트팀 모듈 (ART) — 귀여운 로우폴리 꾸미기 + 풀링 파티클
// 규칙: 로드 시점엔 THREE/DOM을 건드리지 않음(헤드리스 시뮬레이션 안전). 모든 리소스는 처음 쓸 때 한 번만 만들고 재사용.
const ART=(()=>{
 const A={};let sc=null,ren=null,cam=null,root=null,lastView=-1,lastT=0,lastXK=-1,clock=0;
 const U={t:{value:0}};// 장식 흔들림 공용 시간 uniform
 const keep=m=>{m.dispose=()=>{};return m};// 공유 재질: rmM()/도감 정리가 dispose 해도 무시
 const gk=(k,f)=>GC('art_'+k,f);// 지오메트리 캐시(userData.cached=1 → rmM이 dispose 안 함)
 const hx=c=>[((c>>16)&255)/255,((c>>8)&255)/255,(c&255)/255];
 let RND=1;const rnd=()=>{RND=(RND*16807)%2147483647;return(RND-1)/2147483646},rr=(a,b)=>a+(b-a)*rnd();
 // ---------- 공유 재질 ----------
 const MC={};const mat=(k,f)=>MC[k]||(MC[k]=keep(f()));
 const basic=(c,o)=>new THREE.MeshBasicMaterial(Object.assign({color:c},o||{}));
 // ---------- 캔버스 텍스처(전부 1회 생성: 배경, 아틀라스, 세로 그라데이션, 비네트) ----------
 const TX={};
 function cvs(w,h,f){const c=document.createElement('canvas');c.width=w;c.height=h;f(c.getContext('2d'),w,h);const t=new THREE.CanvasTexture(c);return t}
 function atlas(){return TX.at||(TX.at=cvs(256,128,(x)=>{
  const cell=(i,f)=>{x.save();x.translate((i%4)*64+32,Math.floor(i/4)*64+32);f();x.restore()};
  x.fillStyle='#fff';x.strokeStyle='#fff';
  cell(0,()=>{const g=x.createRadialGradient(0,0,0,0,0,30);g.addColorStop(0,'rgba(255,255,255,1)');g.addColorStop(.35,'rgba(255,255,255,.7)');g.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=g;x.fillRect(-32,-32,64,64)});
  cell(1,()=>{const g=x.createRadialGradient(0,0,0,0,0,30);g.addColorStop(0,'rgba(255,255,255,.55)');g.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=g;x.fillRect(-32,-32,64,64);
   x.fillStyle='#fff';x.beginPath();for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5,r=i%2?9:25;x.lineTo(Math.cos(a)*r,Math.sin(a)*r)}x.closePath();x.fill()});
  cell(2,()=>{x.rotate(.5);x.beginPath();x.moveTo(0,-27);x.bezierCurveTo(15,-16,13,12,0,24);x.bezierCurveTo(-13,12,-15,-16,0,-27);x.fill();
   x.globalCompositeOperation='destination-out';x.lineWidth=2.4;x.beginPath();x.moveTo(0,-22);x.lineTo(0,27);x.stroke();
   for(let i=-2;i<=2;i++){x.lineWidth=1.2;x.beginPath();x.moveTo(0,i*7);x.lineTo(i%2?11:-11,i*7-6);x.stroke()}x.globalCompositeOperation='source-over';
   x.fillStyle='rgba(255,255,255,.9)';x.fillRect(-1,22,2,7)});
  cell(3,()=>{x.fillStyle='rgba(255,255,255,.22)';x.beginPath();x.arc(0,0,22,0,7);x.fill();x.lineWidth=4;x.strokeStyle='rgba(255,255,255,.95)';x.beginPath();x.arc(0,0,22,0,7);x.stroke();
   x.fillStyle='#fff';x.beginPath();x.ellipse(-8,-9,6,4,-.7,0,7);x.fill()});
  cell(4,()=>{x.beginPath();x.moveTo(0,-28);x.lineTo(11,0);x.lineTo(0,28);x.lineTo(-11,0);x.closePath();x.fill();x.fillStyle='rgba(170,210,255,.6)';x.beginPath();x.moveTo(0,-28);x.lineTo(11,0);x.lineTo(0,4);x.closePath();x.fill()});
  cell(5,()=>{const g=x.createLinearGradient(-8,0,8,0);g.addColorStop(0,'rgba(255,255,255,0)');g.addColorStop(.5,'rgba(255,255,255,1)');g.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=g;
   x.beginPath();x.moveTo(-2,-29);x.lineTo(5,-6);x.lineTo(-1,-4);x.lineTo(4,29);x.lineTo(-5,2);x.lineTo(1,0);x.closePath();x.fill()});
  cell(6,()=>{[[0,4,16],[-11,6,11],[11,7,12],[-4,-7,12],[7,-4,10]].forEach(e=>{const g=x.createRadialGradient(e[0],e[1],0,e[0],e[1],e[2]);g.addColorStop(0,'rgba(255,255,255,.85)');g.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=g;x.beginPath();x.arc(e[0],e[1],e[2],0,7);x.fill()})});
  cell(7,()=>{x.beginPath();x.moveTo(0,22);x.bezierCurveTo(-30,0,-16,-26,0,-10);x.bezierCurveTo(16,-26,30,0,0,22);x.fill()});
 }))}
 function vgrad(){return TX.vg||(TX.vg=cvs(4,128,(x,w,h)=>{const g=x.createLinearGradient(0,0,0,h);g.addColorStop(0,'#000');g.addColorStop(.7,'#8c8c8c');g.addColorStop(1,'#fff');x.fillStyle=g;x.fillRect(0,0,w,h)}))}
 function vign(){return TX.vn||(TX.vn=cvs(128,128,(x,w,h)=>{const g=x.createRadialGradient(64,64,30,64,64,92);g.addColorStop(0,'#000');g.addColorStop(.6,'#595959');g.addColorStop(1,'#fff');x.fillStyle=g;x.fillRect(0,0,w,h)}))}
 function sky(){return TX.sk||(TX.sk=cvs(4,256,(x,w,h)=>{const g=x.createLinearGradient(0,0,0,h);g.addColorStop(0,'#1d2b52');g.addColorStop(.45,'#122039');g.addColorStop(1,'#08121c');x.fillStyle=g;x.fillRect(0,0,w,h)}))}

 // ---------- 파티클 시스템 (Points 1개 = 드로우콜 1, 풀 고정) ----------
 const VS='attribute vec4 aCol;attribute vec3 aP;uniform float uS;varying vec4 vC;varying vec2 vR;varying float vS;void main(){vC=aCol;vR=vec2(cos(aP.y),sin(aP.y));vS=aP.z;vec4 mv=modelViewMatrix*vec4(position,1.);gl_PointSize=aP.x*uS/-mv.z;gl_Position=projectionMatrix*mv;}';
 const FS='uniform sampler2D uT;varying vec4 vC;varying vec2 vR;varying float vS;void main(){if(vC.a<.003)discard;vec2 p=gl_PointCoord-.5;p=vec2(vR.x*p.x-vR.y*p.y,vR.y*p.x+vR.x*p.y)*1.12+.5;if(p.x<0.||p.y<0.||p.x>1.||p.y>1.)discard;float c=mod(vS,4.),r=floor(vS/4.+.01);vec4 t=texture2D(uT,vec2((c+p.x)*.25,1.-(r+p.y)*.5));gl_FragColor=vec4(vC.rgb*t.rgb,vC.a*t.a);}';
 const PU={uS:{value:600},uT:{value:null}};
 function mkSys(N,blend,ro){const g=new THREE.BufferGeometry(),P=new Float32Array(N*3),C=new Float32Array(N*4),Q=new Float32Array(N*3);
  const ap=new THREE.BufferAttribute(P,3),ac=new THREE.BufferAttribute(C,4),aq=new THREE.BufferAttribute(Q,3);[ap,ac,aq].forEach(a=>a.setUsage(THREE.DynamicDrawUsage));
  g.setAttribute('position',ap);g.setAttribute('aCol',ac);g.setAttribute('aP',aq);g.userData.cached=1;
  const m=new THREE.ShaderMaterial({uniforms:PU,vertexShader:VS,fragmentShader:FS,transparent:true,depthWrite:false,blending:blend});
  const o=new THREE.Points(g,m);o.frustumCulled=false;o.renderOrder=ro;
  return{N,o,P,C,Q,ap,ac,aq,V:new Float32Array(N*3),L:new Float32Array(N),ML:new Float32Array(N),S0:new Float32Array(N),S1:new Float32Array(N),A0:new Float32Array(N),RV:new Float32Array(N),G:new Float32Array(N),D:new Float32Array(N),W:new Float32Array(N),F:new Uint8Array(N),cur:0,live:0,dirty:false}}
 let PA=null,PN=null;// PA: 더하기 블렌딩(불꽃·별·스파크), PN: 일반(깃털·거품·파편·연기)
 // 하나 내보내기 (shape: 0빛 1별 2깃털 3거품 4파편 5스파크 6연기 7하트)
 function E(s,sh,x,y,z,vx,vy,vz,life,s0,s1,col,al,gr,dr,w,fl){if(!s)return;let i=s.cur,n=0;while(s.L[i]>0&&n<s.N){i=(i+1)%s.N;n++}// 빈 칸 찾기, 없으면 가장 오래된 칸 덮어쓰기
  s.cur=(i+1)%s.N;const j=i*3,k=i*4;s.P[j]=x;s.P[j+1]=y;s.P[j+2]=z;s.V[j]=vx;s.V[j+1]=vy;s.V[j+2]=vz;s.L[i]=s.ML[i]=life;s.S0[i]=s0;s.S1[i]=s1;s.A0[i]=al;
  s.C[k]=((col>>16)&255)/255;s.C[k+1]=((col>>8)&255)/255;s.C[k+2]=(col&255)/255;s.C[k+3]=0;s.Q[j]=s0;s.Q[j+1]=rnd()*6.28;s.Q[j+2]=sh;s.RV[i]=(rnd()-.5)*(fl&6?6:2);s.G[i]=gr;s.D[i]=dr;s.W[i]=w;s.F[i]=fl;s.dirty=true}
 function stepSys(s,dt){if(!s.dirty)return;let live=0;const t=clock;
  for(let i=0;i<s.N;i++){if(s.L[i]<=0)continue;s.L[i]-=dt;const j=i*3,k=i*4;if(s.L[i]<=0){s.C[k+3]=0;s.Q[j]=0;continue}live++;
   const V=s.V,d=Math.max(0,1-s.D[i]*dt);V[j+2]-=s.G[i]*dt;V[j]*=d;V[j+1]*=d;V[j+2]*=d;
   if(s.W[i]){const a=s.W[i]*dt,c=Math.cos(a),sn=Math.sin(a),vx=V[j];V[j]=vx*c-V[j+1]*sn;V[j+1]=vx*sn+V[j+1]*c}
   s.P[j]+=V[j]*dt;s.P[j+1]+=V[j+1]*dt;s.P[j+2]+=V[j+2]*dt;
   const f=s.F[i];if(f&6){s.P[j]+=Math.sin(t*4+i)*dt*.5;if(f&2&&V[j+2]<-.55)V[j+2]=-.55}// 깃털: 살랑살랑 천천히
   if(f&1&&s.P[j+2]<.04){s.P[j+2]=.04;V[j+2]=0;V[j]*=.8;V[j+1]*=.8}
   const u=1-s.L[i]/s.ML[i];s.Q[j]=s.S0[i]+(s.S1[i]-s.S0[i])*u;s.Q[j+1]+=s.RV[i]*dt;
   s.C[k+3]=s.A0[i]*Math.min(1,u*8)*(u>.55?Math.max(0,(1-u)/.45):1)}
  s.ap.needsUpdate=s.ac.needsUpdate=s.aq.needsUpdate=true;s.live=live;if(!live)s.dirty=false}
 function clearSys(s){if(!s)return;s.L.fill(0);for(let i=0;i<s.N;i++){s.C[i*4+3]=0;s.Q[i*3]=0}s.ap.needsUpdate=s.ac.needsUpdate=s.aq.needsUpdate=true;s.dirty=false;s.live=0}

 // ---------- 메시 풀: 링 파동, 불기둥, 비네트 ----------
 const RINGS=[],PIL=[];let VG=null,vgL=0,vgM=1,vgA=0;
 function mkPools(){const rg=gk('ring',()=>new THREE.RingGeometry(.82,1,40));
  for(let i=0;i<12;i++){const m=new THREE.Mesh(rg,keep(basic(0xffffff,{transparent:true,opacity:0,depthWrite:false,blending:THREE.AdditiveBlending,side:THREE.DoubleSide})));m.visible=false;m.renderOrder=12;m.userData.L=0;root.add(m);RINGS.push(m)}
  const cg=gk('pillar',()=>{const g=new THREE.CylinderGeometry(1,.7,1,16,1,true);g.rotateX(Math.PI/2);g.translate(0,0,.5);return g});
  for(let i=0;i<3;i++){const m=new THREE.Mesh(cg,keep(basic(0xff9a3c,{transparent:true,opacity:0,alphaMap:vgrad(),depthWrite:false,blending:THREE.AdditiveBlending,side:THREE.DoubleSide})));m.visible=false;m.renderOrder=12;m.userData.L=0;root.add(m);PIL.push(m)}
  VG=new THREE.Mesh(gk('plane1',()=>new THREE.PlaneGeometry(1,1)),keep(basic(0xff0000,{transparent:true,opacity:0,alphaMap:vign(),depthWrite:false,depthTest:false})));VG.visible=false;VG.renderOrder=30;root.add(VG)}
 function ring(x,y,z,r0,r1,life,col,al,delay){let m=null;for(const q of RINGS)if(q.userData.L<=0){m=q;break}if(!m)return;const d=m.userData;d.L=life+(delay||0);d.ML=life;d.r0=r0;d.r1=r1;d.al=al;m.material.color.setHex(col);m.position.set(x,y,z);m.visible=false;m.material.opacity=0}
 function pillar(x,y,col){let m=null;for(const q of PIL)if(q.userData.L<=0){m=q;break}if(!m)return;m.userData.L=m.userData.ML=1.1;m.material.color.setHex(col);m.position.set(x,y,0);m.visible=true}
 function flash(col,al,life){if(!VG)return;VG.material.color.setHex(col);vgA=Math.max(al,vgL>0?vgA*vgL/vgM:0);vgL=vgM=life;placeVG();VG.visible=true}
 function placeVG(){// 카메라 앞 평면을 화면 크기에 맞춰 덮기 (장면 안 효과)
  const zp=4,d=cam.position.z-zp,h=2*d*Math.tan(cam.fov*Math.PI/360)*1.08,w=h*cam.aspect;const lx=new THREE.Vector3();
  cam.getWorldDirection(lx);const k=(cam.position.z-zp)/-lx.z;VG.position.set((cam.position.x+lx.x*k)/XK,cam.position.y+lx.y*k,zp);VG.scale.set(w/XK,h*1.06,1)}
 function stepPools(dt){
  for(const m of RINGS){const d=m.userData;if(d.L<=0)continue;d.L-=dt;if(d.L<=0){m.visible=false;continue}if(d.L>d.ML){m.visible=false;continue}
   const u=1-d.L/d.ML,r=d.r0+(d.r1-d.r0)*(1-(1-u)*(1-u));m.visible=true;m.scale.set(r/XK,r,1);m.material.opacity=d.al*(1-u)}
  for(const m of PIL){const d=m.userData;if(d.L<=0)continue;d.L-=dt;if(d.L<=0){m.visible=false;continue}const u=1-d.L/d.ML,s=.28+.22*Math.sin(Math.min(1,u*2)*Math.PI*.5);
   m.scale.set(s/XK*(1-u*.4),s*(1-u*.4),.6+2.6*Math.min(1,u*3));m.rotation.z+=dt*3;m.material.opacity=(u<.15?u/.15:1-(u-.15)/.85)*.9}
  if(vgL>0){vgL-=dt;if(vgL<=0){VG.visible=false;VG.material.opacity=0}else{placeVG();const u=vgL/vgM;VG.material.opacity=vgA*u*(.85+.15*Math.sin(clock*30))}}}

 // ---------- 연속 방출기 (스킬 비, 불기둥 불꽃) — 드문 이벤트라 소수의 객체만 ----------
 const EM=[];
 function emitter(dur,rate,fn){if(EM.length>6)EM.shift();EM.push({L:dur,r:rate,a:0,fn})}
 function stepEm(dt){for(let i=EM.length-1;i>=0;i--){const e=EM[i];e.L-=dt;e.a+=e.r*dt;let n=Math.min(40,Math.floor(e.a));e.a-=n;while(n-->0)e.fn();if(e.L<=0)EM.splice(i,1)}}
 function clearAll(){clearSys(PA);clearSys(PN);if(typeof PJ!=='undefined'){PJ.forEach(p=>root.remove(p.sp));PJ.length=0;PZL.forEach(z=>root.remove(z.g));PZL.length=0}EM.length=0;RINGS.forEach(m=>{m.userData.L=0;m.visible=false});PIL.forEach(m=>{m.userData.L=0;m.visible=false});if(VG){vgL=0;VG.visible=false}}

 // ---------- 장식 흔들림 셰이더 주입 (인스턴스 위치로 위상, 높이에 비례) ----------
 function sway(m,amt){m.onBeforeCompile=s=>{s.uniforms.uTA=U.t;s.vertexShader='uniform float uTA;\n'+s.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\n#ifdef USE_INSTANCING\nvec3 ipA=instanceMatrix[3].xyz;\n#else\nvec3 ipA=vec3(0.);\n#endif\nfloat swA=sin(uTA*1.7+ipA.x*1.3+ipA.y*.9)*'+amt.toFixed(3)+'*max(position.z,0.);transformed.x+=swA;transformed.y+=swA*.4;')};m.customProgramCacheKey=()=>'artSway'+amt;return m}
 const std=(c,o)=>new THREE.MeshStandardMaterial(Object.assign({color:c,roughness:.85,flatShading:true},o||{}));
 // 여러 지오메트리를 하나로 합치기(위치·법선·색만) — 초기화 때 1회
 function merge(parts){const pos=[],nor=[],col=[];const m4=new THREE.Matrix4(),q=new THREE.Quaternion(),e=new THREE.Euler();
  parts.forEach(([g,x,y,z,sx,sy,sz,rx,ry,rz,c])=>{const n=g.index?g.toNonIndexed():g;m4.compose(new THREE.Vector3(x,y,z),q.setFromEuler(e.set(rx||0,ry||0,rz||0)),new THREE.Vector3(sx,sy,sz));n.applyMatrix4(m4);
   pos.push(...n.attributes.position.array);nor.push(...n.attributes.normal.array);const cc=hx(c==null?0xffffff:c);for(let i=0;i<n.attributes.position.count;i++)col.push(...cc);g.dispose();if(n!==g)n.dispose()});
  const o=new THREE.BufferGeometry();o.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));o.setAttribute('normal',new THREE.Float32BufferAttribute(nor,3));o.setAttribute('color',new THREE.Float32BufferAttribute(col,3));return o}

 // ---------- 보드 밖 장식 ----------
 const DEC=[];// {mesh, list:[[x,y,z,s,rz,sx]]} — XK 바뀌면 행렬 다시 계산
 function inst(geo,mtl,list,colors){const m=new THREE.InstancedMesh(geo,mtl,list.length);m.frustumCulled=false;
  if(colors){const c=new THREE.Color();list.forEach((p,i)=>{c.setHex(colors[i]);m.setColorAt(i,c)});m.instanceColor.needsUpdate=true}
  root.add(m);DEC.push({m,list});return m}
 function layDecor(){const o=new THREE.Object3D();DEC.forEach(d=>{if(!d.m)return;d.list.forEach((p,i)=>{o.position.set(p[0],p[1],p[2]);o.rotation.set(0,0,p[4]||0);o.scale.set(p[3]*(p[5]||1)/XK,p[3]*(p[6]||1),p[3]*(p[7]||1));o.updateMatrix();d.m.setMatrixAt(i,o.matrix)});d.m.instanceMatrix.needsUpdate=true})}
 function buildDecor(){RND=7;const W=COLS+.5,okP=(x,y,m)=>x<-m||x>W+m||y<-m||y>BH+m;// 보드 밖만
  const pick=(n,m,zone)=>{const out=[];let g=0;while(out.length<n&&g++<n*60){const x=rr(zone[0],zone[1]),y=rr(zone[2],zone[3]);if(!okP(x,y,m))continue;if(out.some(p=>Math.hypot(p[0]-x,p[1]-y)<(zone[4]||.3)))continue;out.push([x,y])}return out};
  const Z=[-5,W+6,-4,BH+4];
  // 나무: 원뿔 2단 + 둥근 나무
  const trees=pick(16,.9,[...Z,1.3]).concat([[W+1.2,BH-1.3],[W+2.6,BH-2.4],[W+1.6,BH-4.6]]);
  const cone=gk('dTree',()=>merge([[new THREE.ConeGeometry(.42,.7,7),0,0,.75,1,1,1,PI/2,0,0,0xffffff],[new THREE.ConeGeometry(.32,.6,7),0,0,1.15,1,1,1,PI/2,0,0,0xffffff]]));
  const trunk=gk('dTrunk',()=>{const g=new THREE.CylinderGeometry(.07,.1,.5,6);g.rotateX(PI/2);g.translate(0,0,.25);return g});
  const blob=gk('dBlob',()=>{const g=new THREE.IcosahedronGeometry(.42,0);g.translate(0,0,.78);return g});
  const tA=[],tB=[],tr=[],ca=[],cb=[];trees.forEach(([x,y],i)=>{const s=rr(.75,1.25);tr.push([x,y,0,s]);(i%3===2?tB:tA).push([x,y,0,s,rr(0,6)]);(i%3===2?cb:ca).push([0x1d4a26,0x24562a,0x1a422c,0x2e5c25][i%4])});
  inst(trunk,mat('trunk',()=>std(0x4a2f18)),tr);
  inst(cone,mat('cone',()=>sway(std(0xffffff,{vertexColors:true}),.05)),tA,ca);
  inst(blob,mat('blob',()=>sway(std(0xffffff),.05)),tB,cb.map(c=>c+0x0a0a00));
  // 덤불
  const bush=gk('dBush',()=>merge([[new THREE.IcosahedronGeometry(.22,0),0,0,.14,1,1,.8,0,0,0,0xffffff],[new THREE.IcosahedronGeometry(.17,0),.2,.05,.1,1,1,.8,0,0,0,0xffffff],[new THREE.IcosahedronGeometry(.15,0),-.17,-.03,.09,1,1,.8,0,0,0,0xffffff]]));
  const bs=pick(16,.45,[...Z,.7]).concat([[W+.55,BH-.2],[W+3.2,BH-.8],[W+.7,BH-3.2]]);inst(bush,mat('bush',()=>sway(std(0xffffff,{vertexColors:true}),.04)),bs.map(([x,y])=>[x,y,0,rr(.8,1.3),rr(0,6)]),bs.map((p,i)=>[0x22522a,0x2c5c2a,0x1c482c][i%3]));
  // 돌
  const rock=gk('dRock',()=>{const g=new THREE.DodecahedronGeometry(.16,0);g.translate(0,0,.05);return g});
  const rs=pick(26,.35,[...Z,.45]).concat([[W+1.65,BH-3.75],[W+1.85,BH-3.85],[W+2.95,BH-2.95]]);inst(rock,mat('rock',()=>std(0xffffff)),rs.map(([x,y])=>[x,y,0,rr(.6,1.5),rr(0,6),rr(.8,1.4),1,rr(.5,.8)]),rs.map((p,i)=>[0x4b5260,0x3f4450,0x575e6a,0x5c5651][i%4]));
  // 풀 덤불(가는 원뿔 3개)
  const grass=gk('dGrass',()=>merge([[new THREE.ConeGeometry(.035,.26,4),0,0,.13,1,1,1,PI/2,0,0,0xffffff],[new THREE.ConeGeometry(.03,.2,4),.05,.02,.09,1,1,1,PI/2,.4,0,0xffffff],[new THREE.ConeGeometry(.03,.22,4),-.05,-.01,.1,1,1,1,PI/2,-.4,0,0xffffff]]));
  const gs=pick(150,.12,[...Z,.18]);inst(grass,mat('grass',()=>sway(std(0xffffff),.35)),gs.map(([x,y])=>[x,y,0,rr(.8,1.5),rr(0,6)]),gs.map((p,i)=>[0x30602a,0x2a5824,0x3d6c2e,0x234f22][i%4]));
  // 꽃: 꽃잎 5장(인스턴스 색) + 노란 중심
  const pet=gk('dPetal',()=>{const a=[];for(let i=0;i<5;i++){const t=i*PI*2/5;a.push([new THREE.SphereGeometry(.045,5,3),Math.cos(t)*.05,Math.sin(t)*.05,.2,1,1,.45,0,0,0,0xffffff])}a.push([new THREE.CylinderGeometry(.008,.008,.2,3),0,0,.1,1,1,1,PI/2,0,0,0x3f8f3a]);return merge(a)});
  const cen=gk('dCen',()=>{const g=new THREE.SphereGeometry(.03,6,4);g.translate(0,0,.21);return g});
  const fs=pick(60,.18,[...Z,.25]).concat([[W+.9,BH-2],[W+1.05,BH-2.15],[W+2.9,BH-1.6],[W+.6,BH-5.3],[W+3.1,BH-4.1]]);const fl=fs.map(([x,y])=>[x,y,0,rr(.9,1.5),rr(0,6)]);
  inst(pet,mat('petal',()=>sway(std(0xffffff,{vertexColors:true,emissive:0x111111}),.25)),fl,fs.map((p,i)=>[0xd97aa0,0xe6d78a,0xdedede,0xa898d8,0xe08a95][i%5]));
  inst(cen,mat('fcen',()=>sway(std(0xfacc15,{emissive:0x553300}),.25)),fl);
  // 버섯(빨간 갓 + 흰 점은 생략, 귀여운 둥근 갓)
  const cap=gk('dCap',()=>{const g=new THREE.SphereGeometry(.11,8,5,0,PI*2,0,PI/2);g.rotateX(PI/2);g.scale(1,1,.8);g.translate(0,0,.12);return g});
  const stem=gk('dStem',()=>{const g=new THREE.CylinderGeometry(.035,.05,.13,6);g.rotateX(PI/2);g.translate(0,0,.065);return g});
  const ms=pick(10,.3,[...Z,.6]).concat([[W+1.9,BH-1.1],[W+2.1,BH-1.25]]);const mm=ms.map(([x,y])=>[x,y,0,rr(.8,1.3),0]);
  inst(cap,mat('cap',()=>std(0xffffff,{flatShading:false,roughness:.5})),mm,ms.map((p,i)=>[0xb83232,0xb85a20,0xa850b0][i%3]));inst(stem,mat('stem',()=>std(0xb8ae90)),mm);
  // 작은 연못(오른쪽 위 여백)
  const pond=new THREE.Mesh(gk('dPond',()=>new THREE.CircleGeometry(.55,18)),mat('pond',()=>basic(0x3b82c4,{transparent:true,opacity:.85})));pond.position.set(W+2.3,BH-3.3,-.02);pond.scale.y=.75;root.add(pond);DEC.push({one:pond,sx:1});
  const pr=new THREE.Mesh(gk('dPondR',()=>new THREE.RingGeometry(.55,.66,18)),mat('pondr',()=>basic(0x93c5fd,{transparent:true,opacity:.45})));pr.position.set(W+2.3,BH-3.3,-.015);pr.scale.y=.75;root.add(pr);DEC.push({one:pr,sx:1});
  layDecor()}
 // 땅: 보드 주변 이끼색 → 가장자리로 갈수록 배경색으로 (안개 느낌)
 function buildGround(){const W=COLS+.5,g=gk('ground',()=>{const g=new THREE.PlaneGeometry(W+16,BH+16,24,24),p=g.attributes.position,c=[];const a=hx(0x0c1f15),b=hx(0x1b3f2b),f=hx(0x0b1424);
   for(let i=0;i<p.count;i++){const x=p.getX(i)+W/2,y=p.getY(i)+BH/2,dx=Math.max(0,-x,x-W),dy=Math.max(0,-y,y-BH),d=Math.hypot(dx,dy);
    let col;if(d<.05)col=a;else{const k=Math.min(1,d/6.5),k2=k*k;col=[0,1,2].map(j=>b[j]*(1-k2)+f[j]*k2)}c.push(...col)}
   g.setAttribute('color',new THREE.Float32BufferAttribute(c,3));return g});
  const m=new THREE.Mesh(g,mat('ground',()=>basic(0xffffff,{vertexColors:true})));m.position.set(W/2,BH/2,-.06);m.renderOrder=-1;root.add(m)}
 // 타일 테두리 하이라이트(좌상단 밝게, 우하단 어둡게 → 젤리처럼 볼록) — 지오메트리 1개
 function buildRims(){const P=[],S=[],R0=.4,R1=.53,L=[-.55,.83];
  for(let r=0;r<ROWS;r++)for(let c=0;c<COLS;c++){const cx=cellX(c,r),cy=BH-cellY(r);
   for(let k=0;k<6;k++){const a0=PI/2+k*PI/3,a1=a0+PI/3,am=(a0+a1)/2,sh=Math.cos(am)*L[0]+Math.sin(am)*L[1];
    const v=(a,rad)=>[cx+Math.cos(a)*rad,cy+Math.sin(a)*rad,.031];const p0=v(a0,R0),p1=v(a0,R1),p2=v(a1,R1),p3=v(a1,R0);
    P.push(...p0,...p1,...p2,...p0,...p2,...p3);[0,1,1,0,1,0].forEach(e=>S.push(sh,e))}}
  const g=gk('rims',()=>{const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(P,3));g.setAttribute('aS',new THREE.Float32BufferAttribute(S,2));return g});
  const m=new THREE.Mesh(g,mat('rim',()=>new THREE.ShaderMaterial({transparent:true,depthWrite:false,vertexShader:'attribute vec2 aS;varying vec2 vS;void main(){vS=aS;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
   fragmentShader:'varying vec2 vS;void main(){float s=vS.x,e=vS.y;float a=e*e;gl_FragColor=s>0.?vec4(1.,1.,.9,s*.42*a):vec4(0.,.05,0.,-s*.5*a);}'})));m.renderOrder=1;root.add(m);HX3.rims=m}
 // 🏝️ Kenney Hexagon Kit 3D 타일(CC0, assets/hex3d): 좌석마다 지형 테마, 보드 밖 3칸 둘레는 숲·언덕·산·바다 장식 타일.
 //   모델이 로드되기 전에는 기존 젤리 타일을 보여주고, 로드되면 교체해요. 같은 모델은 InstancedMesh 하나로 그려요.
 const HX3={ok:false,geo:{},mat:null,meshes:[],theme:-1,rims:null};
 const HX3_TH=[{n:'풀밭',b:'grass',m:['grass-forest','grass-hill','grass','grass']},{n:'사막',b:'sand',m:['sand-desert','sand-rocks','sand','sand']},
  {n:'바위산',b:'stone',m:['stone-rocks','stone-hill','stone-mountain','stone']},{n:'흙',b:'dirt',m:['dirt-lumber','grass-hill','dirt','dirt']},{n:'바닷가 섬',b:'grass',m:['water','water-island','water-rocks','water']}];
 function loadHex3(){if(!THREE.GLTFLoader)return;const L=new THREE.GLTFLoader(),names=[...new Set(HX3_TH.flatMap(t=>[t.b,...t.m]))];let n=names.length;const done=()=>{if(--n===0)hex3Ready()};
  names.forEach(nm=>L.load('assets/hex3d/'+nm+'.glb',g=>{g.scene.traverse(o=>{if(o.isMesh&&!HX3.geo[nm]){const geo=o.geometry.clone();geo.applyMatrix4(new THREE.Matrix4().makeRotationX(PI/2));{const pa=geo.attributes.position;let top=0;for(let i=0;i<pa.count;i++){const x=pa.getX(i),y=pa.getY(i),z=pa.getZ(i);if(Math.hypot(x,y)>.45&&z<.3)top=Math.max(top,z)}geo.translate(0,0,-top)}geo.userData.cached=1;HX3.geo[nm]=geo;if(!HX3.mat)HX3.mat=o.material}});done()},undefined,done))}
 function hex3Ready(){if(!HX3.mat||!HX3.geo.grass)return;HX3.ok=true;sc.children.forEach(o=>{if(o.userData&&o.userData.tile)o.visible=false});if(HX3.rims)HX3.rims.visible=false;HX3.theme=-1}
 function hex3Theme(th){if(!HX3.ok||HX3.theme===th)return;HX3.theme=th;HX3.meshes.forEach(m=>root.remove(m));HX3.meshes=[];const T=HX3_TH[th],G={};
  for(let r=-2;r<ROWS+2;r++)for(let c=-1;c<COLS+1;c++){const inB=r>=0&&r<ROWS&&c>=0&&c<COLS,hh=(((c+5)*73856093)^((r+5)*19349663))>>>0,nm=inB?T.b:T.m[hh%4];if(!HX3.geo[nm])continue;
   const col=!inB?[.8,.8,.82]:r===0?[.7,.95,.72]:r===ROWS-1?[1,.55,.5]:((r+c)%2?[.8,.82,.8]:[.88,.88,.88]);(G[nm]=G[nm]||[]).push([cellX(c,r),BH-cellY(r),inB?.97:1,col,inB?0:(hh%6)*PI/3])}
  const mx=new THREE.Matrix4(),q=new THREE.Quaternion(),Z=new THREE.Vector3(0,0,1),cc=new THREE.Color();
  Object.keys(G).forEach(nm=>{const L=G[nm],m=new THREE.InstancedMesh(HX3.geo[nm],HX3.mat,L.length);L.forEach(([x,y,s,col,rot],i)=>{q.setFromAxisAngle(Z,rot);mx.compose(new THREE.Vector3(x,y,0),q,new THREE.Vector3(s,s,1));m.setMatrixAt(i,mx);m.setColorAt(i,cc.setRGB(...col))});
   m.instanceMatrix.needsUpdate=true;if(m.instanceColor)m.instanceColor.needsUpdate=true;m.frustumCulled=false;m.renderOrder=-1;root.add(m);HX3.meshes.push(m)})}
 // 입구/출구 강조: 빛 띠 + 화살표
 const GATE={};
 function buildGates(){const W=COLS+.5,pl=gk('plane1',()=>new THREE.PlaneGeometry(1,1));
  const mk=(col,y,rot)=>{const m=new THREE.Mesh(pl,keep(basic(col,{transparent:true,opacity:.6,alphaMap:vgrad(),depthWrite:false,blending:THREE.AdditiveBlending})));m.scale.set(W+.4,1.2,1);m.rotation.z=rot;m.position.set(W/2,y,.04);m.renderOrder=2;root.add(m);return m};
  GATE.inS=mk(0x34d399,BH+.55,0);GATE.outS=mk(0xff4d4d,-.55,PI);
  const chev=gk('chev',()=>{const s=new THREE.Shape();s.moveTo(-.2,.1);s.lineTo(0,-.1);s.lineTo(.2,.1);s.lineTo(.2,.0);s.lineTo(0,-.2);s.lineTo(-.2,0);s.closePath();return new THREE.ShapeGeometry(s)});
  const row=(r,col)=>{const l=[];for(let c=0;c<COLS;c++)l.push([cellX(c,r),BH-cellY(r),.034,1]);const m=new THREE.InstancedMesh(chev,keep(basic(col,{transparent:true,opacity:.7,depthWrite:false})),l.length);m.frustumCulled=false;m.renderOrder=3;root.add(m);DEC.push({m,list:l});return m};
  GATE.inC=row(0,0xeafff3);GATE.outC=row(ROWS-1,0xfff1f1);
  GATE.inT=[];GATE.outT=[];sc.children.forEach(o=>{const t=o.userData&&o.userData.tile;if(!t||!o.material)return;
   const [c,r]=t,h=((c*73856093)^(r*19349663))>>>0,j=((h%1000)/1000-.5)*.08;
   let col=r===0?0x1f6e3c:r===ROWS-1?0x7e2f29:(r+c)%2?0x24522a:0x204a27;const cc=new THREE.Color(col);cc.offsetHSL(j*.3,0,j);o.material.color.copy(cc);
   if(r===0){o.material.emissive.setHex(0x0e7a3a);GATE.inT.push(o)}else if(r===ROWS-1){o.material.emissive.setHex(0x8a1c14);GATE.outT.push(o)}})}
 // 반딧불 (보드 바깥 여백을 떠다님, 셰이더 애니메이션 → CPU 0)
 function buildFireflies(){const N=36,p=[],W=COLS+.5;RND=99;let g=0;while(p.length<N*3&&g++<5000){const x=rr(-3,W+4),y=rr(-2.5,BH+2.5);if(x>-.2&&x<W+.2&&y>-.2&&y<BH+.2)continue;p.push(x,y,rr(.3,1.6))}
  const geo=gk('ffly',()=>{const b=new THREE.BufferGeometry();b.setAttribute('position',new THREE.Float32BufferAttribute(p,3));return b});
  const m=new THREE.Points(geo,mat('ffly',()=>new THREE.ShaderMaterial({uniforms:{uT:U.t,uS:PU.uS,uA:PU.uT},transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,
   vertexShader:'uniform float uT,uS;varying float vA;void main(){vec3 p=position;float h=fract(sin(dot(p.xy,vec2(12.9,78.2)))*43758.5)*6.28;p.x+=sin(uT*.6+h)*.25;p.y+=cos(uT*.5+h*1.3)*.25;p.z+=sin(uT*.9+h)*.15;vA=.35+.65*max(0.,sin(uT*1.4+h*2.));vec4 mv=modelViewMatrix*vec4(p,1.);gl_PointSize=.16*uS/-mv.z;gl_Position=projectionMatrix*mv;}',
   fragmentShader:'uniform sampler2D uA;varying float vA;void main(){vec4 t=texture2D(uA,vec2(gl_PointCoord.x*.25,1.-gl_PointCoord.y*.5));gl_FragColor=vec4(vec3(1.,.95,.55)*t.rgb,t.a*vA*.8);}'})));
  m.frustumCulled=false;m.renderOrder=5;root.add(m)}

 A.init=({scene,renderer,camera})=>{if(root||!scene)return;sc=scene;ren=renderer;cam=camera;
  root=new THREE.Group();root.name='art';sc.add(root);
  sc.background=sky();PU.uT.value=atlas();
  buildGround();buildRims();buildGates();loadHex3();buildDecor();buildFireflies();mkPools();
  PA=mkSys(170,THREE.AdditiveBlending,11);PN=mkSys(170,THREE.NormalBlending,10);root.add(PN.o,PA.o);lastXK=XK;
  const pre=new THREE.Group();'sgtwax'.split('').forEach(k=>pre.add(new THREE.Mesh(tpr('B'),TMAT(k))));pre.position.z=-50;root.add(pre);
  try{ren.compile(sc,cam)}catch(e){}root.remove(pre)};// 셰이더 미리 컴파일 → 첫 이펙트 때 멈칫 방지

 // ---------- 새 꾸미기 ----------
 // 지오메트리는 (새 종류+눈 배치) 별로 1번만 만들어 캐시 → 유닛이 수백 마리 생겨도 지오메트리 수 고정
 const V3=(x,y,z)=>new THREE.Vector3(x,y,z),SG=()=>new THREE.SphereGeometry(1,12,9),CG=()=>new THREE.CircleGeometry(1,20),KG=()=>new THREE.ConeGeometry(1,1,12),BG=()=>new THREE.BoxGeometry(1,1,1),YG=()=>new THREE.CylinderGeometry(1,1,1,14);
 const FV={};const isDark=c=>c.r<.2&&c.g<.2&&c.b<.2;
 function headOf(id){const tall=id==='ostrich',z0=tall?.6:.26+(LIFT[id]||0),egg=id==='egg_legs',x=HEADX[id];if(x)return{tall,z0,egg,hz:x.hz,hy:x.hy,hr:x.hr};return{tall,z0,egg,hz:tall?1.3:z0+.2,hy:tall?-.28:-.3,hr:id==='owl'?.2:id==='chick'?.17:.15}}
 // 실제 눈 메시 찾기(다른 팀이 눈 모양을 바꿔도 따라감): 앞쪽의 작은 구, 어두운 색 또는 부엉이/흡혈 눈
 function findEyes(m,id){const out=[];m.children.forEach(o=>{if(!o.isMesh||!o.geometry||o.geometry.type!=='SphereGeometry')return;const r=o.geometry.parameters.radius*Math.max(o.scale.x,o.scale.y,o.scale.z);
  if(r>.09||r<.015||o.position.y>-.12||Math.abs(o.position.x)<.03||Math.abs(o.position.x)>.2)return;const c=o.material&&o.material.color;if(!c)return;
  if(isDark(c)||(id==='owl'&&c.r>.9&&c.g>.8)||(id==='vampire'&&c.r>.9&&c.g<.3))out.push(o)});return out.slice(0,2)}
 function faceParts(id,eyes,ek,H){// 하이라이트(큰 점+작은 점) + 볼터치 + (수상한 알: 삐딱한 눈썹·식은땀)
  const parts=[],q=new THREE.Quaternion(),Z=V3(0,0,1),e=new THREE.Euler(),Hc=H.egg?V3(0,0,H.z0):V3(0,H.hy,H.hz);
  const onEgg=d=>{const a=.26,b=.325,c=.247,k=1/Math.sqrt((d.x/a)**2+(d.y/b)**2+(d.z/c)**2),p=d.clone().multiplyScalar(k);return[p.clone().add(Hc),V3(p.x/a/a,p.y/b/b,p.z/c/c).normalize()]};
  eyes.forEach(([x,y,z,er])=>{const s=Math.sign(x)||1,E=V3(x,y,z);er*=ek;
   let h=E.clone().add(V3(s*.2,-.55,.8).normalize().multiplyScalar(er*.72));if(!H.egg){const d=h.clone().sub(Hc);if(d.length()<H.hr+.006)h=Hc.clone().add(d.setLength(H.hr+.006))}
   parts.push([SG(),h.x,h.y,h.z,er*.38,er*.38,er*.38,0,0,0,0xffffff]);const h2=E.clone().add(V3(-s*.35,-.7,.15).normalize().multiplyScalar(er*.88));parts.push([SG(),h2.x,h2.y,h2.z,er*.17,er*.17,er*.17,0,0,0,0xffffff])});
  [-1,1].forEach(s=>{const d=V3(s*.72,-.58,H.egg?-.05:.12).normalize();let p,n;if(H.egg)[p,n]=onEgg(d);else{n=d;p=Hc.clone().add(d.clone().multiplyScalar(H.hr))}
   p.add(n.clone().multiplyScalar(.006));q.setFromUnitVectors(Z,n);e.setFromQuaternion(q);const cr=H.egg?.075:H.hr*.3;parts.push([CG(),p.x,p.y,p.z,cr,cr*.78,1,e.x,e.y,e.z,0xff8fb1])});
  if(H.egg){[-1,1].forEach(s=>{const[p]=onEgg(V3(s*.3,-.72,.62).normalize());parts.push([BG(),p.x,p.y-.01,p.z+.01,.1,.022,.026,0,s>0?-.45:.12,0,0x3b2a1a])});// 한쪽만 치켜뜬 눈썹
   const[p]=onEgg(V3(.85,-.3,.55).normalize());parts.push([SG(),p.x+.015,p.y,p.z,.03,.03,.05,0,.3,0,0x93d5ff])}// 식은땀
  return parts}
 // 새 유닛 장식(수상한 알 연구소): 껍데기 모자/바지, 속성 토핑, 공룡 가시·꼬리, 근육 대장닭
 function accParts(b,H){const id=b.id,P=[],G=[],c=b.col==null?0xfde047:b.col,top=V3(0,H.hy,H.hz+H.hr),sh=0xfff7e6;
  const hat=(col)=>{const k=H.hr/.15;P.push([new THREE.SphereGeometry(1,10,5,0,PI*2,0,PI*.42),0,H.hy,H.hz+.06*k,.165*k,.165*k,.165*k,PI/2,0,0,col||sh]);for(let i=0;i<7;i++){const a=i*PI*2/7;P.push([KG(),Math.cos(a)*.155*k,H.hy+Math.sin(a)*.155*k,H.hz+(.06+.045)*k,.035,.07,.035,PI/2,0,0,col||sh])}};
  const cup=(col)=>{P.push([new THREE.SphereGeometry(1,12,6,0,PI*2,PI*.52,PI*.48),0,0,.2,.3,.34,.3,PI/2,0,0,col||sh]);for(let i=0;i<9;i++){const a=i*PI*2/9;P.push([KG(),Math.cos(a)*.3,Math.sin(a)*.34,.2+.04,.05,.1,.05,PI/2,0,0,col||sh])}};
  const ox=top.x,oy=top.y,oz=top.z;
  // ---------- 🎭 새별 특색 디테일 (이름에 맞는 소품) ----------
  const HEMI=()=>new THREE.SphereGeometry(1,10,6,0,PI*2,0,PI*.42),SPH=()=>new THREE.SphereGeometry(1,10,7),TOR=t=>new THREE.TorusGeometry(1,t,6,24);
  const hy=H.hy,hz=H.hz,hr=H.hr,z0=H.z0,UP=[PI/2,0,0],DN=[-PI/2,0,0],FW=[0,0,PI],BK=[0,0,0],O=[0,0,0],zt=hz+hr;
  const S=(x,y,z,a,b2,d,col,g,r)=>(g?G:P).push([SPH(),x,y,z,a,b2,d,...(r||O),col]),
   Su=(x,y,z,r,col,g)=>S(x,y,z,r,r,r,col,g),
   K=(x,y,z,r,h,rot,col,g)=>(g?G:P).push([KG(),x,y,z,r,h,r,...rot,col]),
   Bx=(x,y,z,w,d,h,rot,col,g)=>(g?G:P).push([BG(),x,y,z,w,d,h,...rot,col]),
   Y=(x,y,z,r,h,rot,col,g)=>(g?G:P).push([YG(),x,y,z,r,h,r,...rot,col]),
   T=(x,y,z,R,t,rot,col,g)=>(g?G:P).push([TOR(t/R),x,y,z,R,R,R,...rot,col]),
   Hm=(x,y,z,r,rot,col,g)=>(g?G:P).push([HEMI(),x,y,z,r,r,r,...rot,col]);
  const mxc=(c1,c2,k)=>{const f=s=>[(c1>>s)&255,(c2>>s)&255];const m=s=>{const[a,b]=f(s);return Math.round(a+(b-a)*k)};return(m(16)<<16)|(m(8)<<8)|m(0)};
  const BSc=(typeof BODYS!=='undefined'&&!CHICKY[id]&&!PENG[id]&&id!=='crocbird'&&id!=='ostrich'&&BODYS[id])||[1,1.25,.95],BX0=.26*BSc[0],BY0=.26*BSc[1],BZ0=.26*BSc[2];
  const fy=(x,z)=>-BY0*Math.sqrt(Math.max(0,1-(x/BX0)**2-((z-z0)/BZ0)**2));
  const belly=(col,s)=>S(0,-.14*BSc[1]/1.25,z0-.02,.2*(s||1)*BSc[0],.2*(s||1),.19*(s||1)*BSc[2]/.95,col);
  const sides=f=>[-1,1].forEach(f);
  const D={
   // 과일아닌 키위: 배에 키위 단면, 몸은 털북숭이
   kiwi(){const zc=z0-.03;S(0,-.29,zc,.17,.07,.17,0x84cc16);S(0,-.30,zc,.11,.07,.11,0xd9f99d);S(0,-.305,zc,.04,.07,.04,0xfffbe6);
    for(let i=0;i<10;i++){const a=i*PI/5;Su(Math.cos(a)*.07,-.352,zc+Math.sin(a)*.07,.011,0x1f2937)}
    [[.12,.1],[-.13,.05],[.02,.22],[-.08,.2],[.15,-.05]].forEach(([x,y])=>{const z=z0+.247*Math.sqrt(Math.max(0,1-(x/.26)**2-(y/.325)**2));S(x,y,z-.005,.055,.045,.04,mxc(c,0x2a1708,.5))});
    sides(s=>Bx(s*.08,-.46,hz,.11,.012,.012,[0,0,s*.35],0x3b2a1a))},
   // 삐약이: 삐죽 머리카락 + 솜털 배
   chick(){belly(0xfef9c3,.8);[[-.035,.35],[0,0],[.035,-.35]].forEach(([x,l])=>K(x,hy+.02,zt+.015,.02,.1,[PI/2,0,l],c))},
   // 탈주 칠면조: 청교도 모자 + 식은땀
   turkey(){const BK=0x18181b;Hm(0,hy,zt-.06,.12,UP,BK);Y(0,hy,zt-.03,.175,.016,UP,BK);Y(0,hy,zt-.012,.119,.028,UP,0x7c2d12);
    S(0,hy-.16,hz-.12,.035,.035,.07,0xdc2626);S(.018,hy-.19,hz-.02,.016,.02,.055,0xdc2626);S(0,-.2,z0+.05,.17,.12,.16,0x7a4a30);
    const th=-.65,sn=Math.sin(th),cs=Math.cos(th),cy=.24,cz=z0+.02;for(let i=0;i<11;i++){const a=(i-5)*.25,f=(R,a2,b2,d,col)=>{const x=Math.sin(a)*R,z=Math.cos(a)*R;S(x,cy-z*sn,cz+z*cs,a2,b2,d,col,0,[th,a,0])};
     f(.25,.078,.022,.25,i%2?0x6b4226:0x4a2c1a);f(.38,.07,.024,.03,0x2b1a10);f(.46,.068,.026,.05,0xe8c9a0)}
    sides(s=>S(s*.19,hy+.03,hz+.06,.022,.032,.022,0x7dd3fc,1));Su(.2,hy+.1,hz-.02,.018,0x7dd3fc,1)},
   // 새벽5시 수탉: 알람시계 + 부스스한 목털
   rooster(){T(0,-.34,z0,.078,.018,[PI/2,0,0],0xef4444);Y(0,-.332,z0,.07,.02,O,0xffffff);Bx(0,-.345,z0+.018,.01,.006,.045,O,0x111827);Bx(.014,-.345,z0,.034,.006,.01,O,0x111827);
    sides(s=>{Su(s*.048,-.33,z0+.082,.02,0xfacc15);S(s*.12,hy+.12,hz-.08,.06,.07,.06,0xf59e0b)})},
   // 닭둘기: 닭+비둘기 → 작은 볏, 무지갯빛 목
   pigeon(){belly(0xcbd5e1,1.05);S(-.1,hy+.1,hz-.07,.055,.06,.055,0x34d399);S(.1,hy+.1,hz-.07,.055,.06,.055,0xa855f7);Su(0,hy+.14,hz-.11,.055,0x38bdf8);
    [[0,-.045],[0,0],[0,.045]].forEach(([x,y],i)=>S(0,hy+y,zt+.005+(i===1?.015:0),.022,.032,.034,0xef4444));Su(.1,-.52,.36,.02,0xfcd34d,1)},
   // 깡패 거위: 화난 눈썹 + 금목걸이
   goose(){belly(0xffffff,1.1);sides(s=>Bx(s*.075,hy-.085,hz+.1,.085,.025,.02,[0,s*-.4,0],0x1f2937));T(0,hy+.08,hz-.15,.15,.022,O,0xfacc15);Su(0,-.372,.31,.03,0xfacc15);
    S(.12,hy-.02,hz-.02,.035,.03,.03,0xfecaca)},
   // 따라쟁이 앵무: 알록달록 + 말풍선
   parrot(){const G1=0x2e7d32,G2=0x66bb6a,G3=0x9ccc65,OR=0xf59e0b,OD=0xd97706;belly(G2);
    [[.08,[-.09,0,.09]],[0,[-.13,-.045,.045,.13]],[-.08,[-.09,0,.09]]].forEach(([dz,xs])=>xs.forEach(x=>S(x,fy(x,z0+dz)+.022,z0+dz,.068,.028,.05,0x81c784)));// 가슴 비늘 깃털
    S(0,hy-.165,hz-.005,.07,.085,.065,OR);K(0,hy-.235,hz-.065,.038,.09,[-PI/2+.35,0,0],OR);// 굽은 윗부리 + 갈고리 끝
    S(0,hy-.13,hz-.105,.045,.055,.028,OD);S(0,hy-.15,hz-.065,.04,.05,.022,0x7f1d1d);// 벌린 아랫부리 + 입속
    sides(s=>{S(s*.115,hy-.085,hz-.02,.04,.02,.035,0xef5350);Bx(s*.075,hy-.1,hz+.115,.085,.02,.022,[0,s*.5,0],0x1b1b1b)});// 빨간 볼 + 화난 눈썹
    [[-.045,-.35,.1],[0,0,.15],[.045,.35,.1]].forEach(([x,rz,h])=>K(x,hy+.06,zt+.02,.032,h,[1,0,rz],x?G1:c))},// 뒤로 넘긴 초록 볏
   // 닌자 까마귀: 머리띠 + 나부끼는 끈 + 수리검
   crow(){T(0,hy,hz+.04,hr+.006,.022,O,0xdc2626);Bx(0,hy-hr-.002,hz+.04,.1,.014,.05,O,0xcbd5e1);Su(0,hy+hr+.01,hz+.04,.035,0xdc2626);
    sides(s=>Bx(s*.04,hy+hr+.09,hz+.01,.035,.13,.012,[0,0,s*.3],0xdc2626));
    [0,PI/2].forEach(a=>Bx(.3,-.02,.5,.2,.016,.04,[0,0,a+.6],0xcbd5e1));Su(.3,-.02,.5,.026,0xdc2626);belly(0x64748b,.85);[-1,0,1].forEach(i=>K(i*.07,.34,z0+.08,.045,.26,[.55,0,-i*.28],0x312e4a))},
   // 과자도둑 해적: 금귀걸이 + 훔친 과자 봉지
   pirate(){T(.15,hy,hz-.05,.035,.008,[0,PI/2,0],0xfacc15);S(0,-.02,z0-.22,.11,.13,.14,0xfffbeb);S(.03,-.06,z0-.15,.03,.02,.035,0x93c5fd);
    sides(s=>{K(s*.06,-.03,z0-.13,.02,.07,[PI,0,s*.3],0xfacc15);Su(s*.13,hy+.06,hz+.1,.02,0x7dd3fc,1)});Bx(0,.02,z0+.3,.1,.06,.12,O,0x1e3a8a);Su(0,-.015,z0+.3,.025,0xfde047);
    /* 🗡 해적 칼(오른쪽 날개에 치켜듦) */Bx(.31,-.16,z0+.28,.018,.05,.4,[-.55,0,.15],0xe5e7eb);Bx(.31,-.04,z0+.1,.022,.14,.025,[-.55,0,.15],0xfacc15);Bx(.31,.01,z0+.03,.03,.03,.1,[-.55,0,.15],0x78350f);Su(.31,.03,z0-.02,.025,0xfacc15)},
   // 꽥꽥 오리: 밤색 가슴 + 말린 꼬리 + 반짝 머리
   duck(){S(0,-.14,z0+.04,.21,.18,.18,0x7c2d12);K(0,.36,z0+.12,.03,.1,[-.9,0,0],0x111827);K(0,.39,z0+.17,.02,.07,[.6,0,0],0x111827);
    S(0,.02,z0-.05,.36,.42,.09,0xffffff);for(let i=0;i<4;i++){const a=i*PI/2+PI/4;S(Math.cos(a)*.34,Math.sin(a)*.4,z0-.05,.11,.11,.095,0xef4444,0,[0,0,a])}
    sides(s=>{Bx(s*.065,hy-.125,hz+.06,.08,.02,.055,O,0x111827);Bx(s*.065,hy-.135,hz+.06,.06,.01,.04,O,0x38bdf8,1)});Bx(0,hy-.13,hz+.075,.05,.015,.012,O,0x111827);
    Y(0,hy,zt-.02,.2,.012,UP,0xeab308);Hm(0,hy,zt-.04,.1,UP,0xfacc15);Y(0,hy,zt-.005,.102,.025,UP,0xef4444)},
   // 헤드뱅 딱따구리: 모히칸 + 땀받이 + 박치기 선
   woodpecker(){const R=0xdc2626,W=0xffffff;S(0,hy+.015,hz+.06,.152,.158,.1,R);K(0,hy+.1,zt+.02,.05,.17,[.82,0,0],R);K(0,hy+.16,zt-.03,.035,.12,[.6,0,0],0xb91c1c);
    sides(s=>{Bx(s*.118,hy-.01,hz-.015,.02,.17,.034,[0,0,s*.25],0x111827);S(s*.33,.03,z0+.1,.03,.035,.012,W);S(s*.29,-.05,z0+.1,.025,.03,.012,W);Bx(s*.2,hy,hz+.1,.012,.1,.012,[0,0,s*.5],W,1)});
    T(0,hy,hz+.025,hr+.008,.018,[.25,0,0],W);[0,.08,.16,.24].forEach(y=>S(0,y,z0+.247*Math.sqrt(Math.max(0,1-(y/.325)**2))-.012,.17,.022,.02,W));
    K(0,.37,z0-.06,.055,.3,[-.5,0,0],0x111827);K(0,.43,z0-.1,.035,.16,[-.5,0,0],W);
    [[.09,-.74,.04,.5],[-.08,-.7,.1,-.7],[.02,-.8,.16,1.2]].forEach(([x,y,dz,a])=>Bx(x,y,hz-.12+dz,.045,.03,.02,[a,a*.5,a],0xb45309))},
   // 똥폭격 갈매기: 조종사 고글 + 등에 업은 똥 폭탄
   seagull(){T(0,hy,hz+.06,hr+.006,.014,O,0x78350f);sides(s=>{S(s*.075,-.372,hz+.115,.05,.02,.05,0x7dd3fc);T(s*.075,-.378,hz+.115,.05,.01,[PI/2,0,0],0xfbbf24)});Bx(0,-.372,hz+.115,.04,.012,.012,O,0x78350f);
    S(0,.12,z0+.29,.1,.1,.06,0x92400e);S(0,.12,z0+.35,.075,.075,.05,0x92400e);S(0,.12,z0+.4,.045,.045,.045,0x92400e);sides(s=>{Su(s*.025,.07,z0+.36,.014,0xffffff);Su(s*.025,.058,z0+.36,.007,0x111827)})},
   // 발바쁜 백조: 왕관 + 날개깃 + 식은땀
   swan(){Su(.19,hy+.02,hz+.1,.034,0x7dd3fc,1);K(.19,hy+.02,hz+.15,.026,.06,UP,0x7dd3fc,1);sides(s=>Bx(s*.045,-.43,hz-.01,.03,.03,.045,O,0x111827));
    S(0,-.44,hz,.045,.03,.04,0x1f2937);sides(s=>{K(s*.1,.1,z0+.22,.06,.3,[PI/2-.5,0,-s*.2],0xffffff);Su(s*.18,hy+.05,hz+.1,.02,0x7dd3fc,1)});Su(.2,hy+.1,hz,.015,0x7dd3fc,1)},
   // 펭귄 삼형제: 빨간 목도리 + 볼의 노란 무늬
   penguin(){T(0,-.03,.6,.165,.04,O,0xdc2626);T(0,-.03,.63,.167,.012,O,0xffffff);Bx(.06,-.2,.47,.05,.03,.15,[0,.3,0],0xb91c1c);Bx(.06,-.215,.42,.052,.01,.03,O,0xffffff);S(0,hy-hr-.035,hz-.045,.028,.05,.014,0xf59e0b);[0,PI/3,-PI/3].forEach(a=>Bx(0,hy,zt+.11,.12,.012,.016,[0,a,0],0xbae6fd,1));Su(0,hy,zt+.11,.018,0xffffff,1)},
   // 드라큘라 박쥐: 뾰족 귀 + 높은 칼라 + 나비넥타이
   vampire(){sides(s=>{K(s*.1,hy+.02,zt+.0,.04,.16,[PI/2,0,-s*.25],0x450a0a);Bx(s*.13,hy+.16,hz-.1,.1,.02,.2,[0,s*.5,0],0x1f1020);K(s*.04,-.35,.36,.035,.06,[0,0,-s*PI/2],0xdc2626)});Su(0,-.35,.36,.025,0xdc2626)},
   // 자뻑 공작: 티아라 + 반짝이 + 에메랄드 가슴
   peacock(){S(0,-.15,z0,.2,.18,.17,0x22d3ee);[-1,0,1].forEach(i=>{const a=-i*.32;Y(i*.03,hy+.02,zt+.05,.007,.12,[PI/2,0,a],0x0f766e);Su(i*.03-Math.sin(a)*.065,hy+.02,zt+.05+Math.cos(a)*.065,.026,0x22d3ee)});
    sides(s=>Bx(s*.075,hy-.1,hz+.0,.05,.012,.014,[0,s*.2,0],0xffffff))},
   // 안멸종 도도: 곱슬 머리 + 꼬리 솜 + 통통 배
   dodo(){belly(0xd9b48f,.95);T(0,hy,hz+.035,hr+.01,.03,[.15,0,0],0x854d0e);Su(.14,hy+.03,hz+.05,.032,0x854d0e);K(.17,hy+.06,hz+.05,.02,.09,[0,0,-.9],0x854d0e);
    sides(s=>Hm(s*.08,hy-.095,hz+.065,.052,UP,0x8fa0c4));S(0,hy-.25,hz-.025,.064,.14,.06,0xe9cfa6);S(0,hy-.4,hz-.03,.088,.095,.084,0xee6c3b);K(0,hy-.47,hz-.105,.05,.12,[-PI/2+.3,0,0],0xee6c3b);sides(s=>Su(s*.03,hy-.33,hz+.02,.012,0x5b3a29));S(0,hy-.27,hz-.09,.048,.115,.026,0xd9b48f);S(0,hy-.3,hz-.066,.042,.095,.02,0x9b2226);// 도도 부리: 긴 부리 + 불룩한 갈고리 끝 + 벌린 입(타령 중)
    
    sides(s=>S(s*.115,hy-.1,hz-.03,.04,.012,.035,0xef4444,0,[0,0,s*.4]));
    [[.15,z0+.1,0xf472b6],[-.16,z0+.04,0x60a5fa],[.05,z0-.12,0x4ade80],[-.05,z0+.17,0xfacc15],[.22,z0-.05,0x38bdf8]].forEach(([x,z,col],i)=>S(x,fy(x,z)-.004,z,.075,.022,.07,col,0,[0,i*.5,0]));T(0,0,z0-.03,.325,.02,O,0xa16207);Su(.1,-.31,z0-.04,.03,0xa16207);// 누더기 조각 + 새끼줄 허리띠
    Y(.3,-.04,z0-.05,.06,.12,UP,0x9ca3af);Y(.3,-.04,z0-.03,.061,.04,UP,0xdc2626);Bx(.27,-.04,z0+.06,.008,.008,.12,[0,.4,0],0x6b7280);
    sides(s=>Bx(-.3+s*.02,-.18,z0+.08,.012,.18,.02,[0,0,s*.25],0x9ca3af));Su(-.3,-.1,z0+.08,.022,0x6b7280);
    [[.06,.42,z0+.12],[-.06,.4,z0+.1]].forEach(([x,y,z])=>Su(x,y,z,.06,0xf5f1e6))},
   crocbird(){const G1=0x3d9140,G2=0x5cb85f,G3=0x256d2a,BL=0xf3e9b0,WT=0xffffff,SP2=0xf4a340,BK=0x111827;
    // 🐊 악어: 통통한 몸 + 크림색 배 + 위로 들린 주둥이(입 벌림) + 이빨 + 등 가시 + 발가락 + 말린 꼬리
    S(0,.12,.18,.33,.6,.17,G1);S(0,.12,.11,.29,.54,.11,BL);S(0,-.5,.25,.21,.3,.12,G1,0,[-.15,0,0]);S(0,-.8,.32,.155,.2,.07,G1,0,[-.38,0,0]);S(0,-.78,.285,.135,.19,.03,0xe57373,0,[-.38,0,0]);
    sides(s=>{for(let i=0;i<5;i++)K(s*(.118-i*.007),-.6-i*.07,.185+i*.031,.024,.075,DN,WT);// 윗니
     Su(s*.12,-.4,.39,.075,G2);Su(s*.125,-.445,.41,.052,WT);Su(s*.13,-.485,.415,.026,BK);Su(s*.14,-.5,.43,.009,WT);Bx(s*.12,-.44,.475,.09,.03,.018,[0,s*.25,0],G3);// 눈두덩·눈·눈썹
     S(s*.19,-.46,.24,.035,.02,.03,0xf48fb1);Su(s*.05,-.95,.4,.02,G3);// 볼터치·콧구멍
     [[.27,-.24],[.28,.38]].forEach(([x,y])=>{S(s*x,y,.07,.09,.12,.07,G1);[-1,0,1].forEach(t=>{Su(s*(x+.05)+t*.035,y-.1,.03,.03,G2);K(s*(x+.05)+t*.035,y-.135,.025,.012,.03,FW,BL)})})});
    for(let i=0;i<6;i++){const y=-.22+i*.13;sides(s=>K(s*.11,y,.33-Math.abs(y-.1)*.1,.032,.075,UP,G3))}for(let i=0;i<4;i++)K(0,.34+i*.12,.35-i*.03,.04,.1,UP,SP2);// 등 가시(가운데 줄은 주황)
    K(0,.86,.16,.14,.5,[.18,0,0],G1);K(0,1.1,.25,.045,.3,[.6,0,0],G1);for(let i=0;i<3;i++)K(0,.8+i*.13,.27+i*.05,.03,.07,UP,SP2);// 위로 말린 꼬리
    K(.07,-.67,.245,.022,.065,DN,0xfacc15);// 금니
    // 🐦 악어새: 회색 몸 + 흰 배·얼굴 + 주황 발 + 이마 반사경
    S(0,-.1,z0-.01,.125,.11,.14,WT);S(0,hy-.06,hz-.05,.095,.07,.075,WT);sides(s=>{S(s*.07,-.09,.335,.04,.06,.016,0xf59e0b);S(s*.085,hy-.085,hz-.025,.028,.012,.022,0xf9a8d4)});
    T(0,hy,hz+.07,hr*.82,.013,O,0x374151);Y(.03,hy-.1,hz+.1,.046,.014,O,0x9ca3af);Y(.03,hy-.11,hz+.1,.036,.01,O,0xe5e7eb);Su(.03,hy-.116,hz+.1,.01,0x9ca3af);
    // 🪥 칫솔: 가슴 앞을 비스듬히 가로지르는 큰 칫솔(손잡이·미끄럼 방지 띠·목·머리·솔·치약)
    {const R2=[0,-.726,-PI/2],ax=.747,az=.664,nx=-.664,nz=.747,cx=.11,cy=-.3,cz=.5,BLU=0x2f80ed,LB=0x90caf9,at2=(t,n)=>[cx+ax*t+nx*n,cy,cz+az*t+nz*n];
     let q=at2(.04,0);Y(q[0],q[1],q[2],.03,.44,R2,BLU);q=at2(-.18,0);Su(q[0],q[1],q[2],.032,BLU);[-.12,-.06,0].forEach(t=>{q=at2(t,0);Y(q[0],q[1],q[2],.034,.025,R2,LB)});
     q=at2(.3,0);Y(q[0],q[1],q[2],.02,.1,R2,BLU);q=at2(.43,0);Bx(q[0],q[1],q[2],.075,.19,.04,R2,BLU);q=at2(.525,0);Su(q[0],q[1],q[2],.038,BLU);
     q=at2(.43,.05);Bx(q[0],q[1],q[2],.068,.17,.065,R2,WT);[-.05,0,.05].forEach(t=>{q=at2(.43+t,.052);Bx(q[0],q[1],q[2],.07,.012,.066,R2,LB)});
     q=at2(.4,.095);S(q[0],q[1],q[2],.05,.03,.03,0x7fe3d0,0,[0,-.726,0]);q=at2(.44,.108);S(q[0],q[1],q[2],.04,.028,.026,WT,0,[0,-.726,0]);q=at2(.475,.118);Su(q[0],q[1],q[2],.02,0x7fe3d0);
     q=at2(.1,0);S(q[0],q[1]+.01,q[2],.055,.05,.05,0x64748b)}},// 칫솔을 쥔 날개 끝
   humbee(){const BK=0x111827;[[.04,.25],[.14,.23],[.24,.17]].forEach(([y,r])=>T(0,y,z0,r,.035,[PI/2,0,0],BK));K(0,.4,z0-.01,.03,.13,O,BK);
    sides(s=>{Bx(s*.05,hy+.02,zt+.06,.012,.012,.13,[0,s*.4,0],BK);Su(s*.08,hy+.03,zt+.12,.025,0xfacc15)});S(0,hy+.02,hz+.02,hr*1.01,hr*1.01,hr*.6,0x22c55e,0,[.3,0,0]);S(0,hy-.12,hz-.08,.05,.03,.03,0xf43f5e)},
   pelican(){S(0,-.56,hz-.19,.17,.3,.15,0xfb923c);S(0,-.54,hz-.14,.14,.25,.11,0xfdba74);
    [[-.06,-.46],[.05,-.53],[-.01,-.62]].forEach(([x,y])=>{Su(x,y,hz+.01,.055,0xfde047);sides(s=>Su(x+s*.02,y-.048,hz+.025,.01,0x111827));K(x,y-.06,hz+.005,.012,.03,DN,0xf97316)});
    Y(0,hy,zt-.02,.13,.06,UP,0x1e3a8a);Bx(0,hy-.12,zt-.04,.16,.08,.015,[.2,0,0],0x1e3a8a);Bx(0,hy-.03,zt+.012,.06,.04,.03,O,0xfacc15);
    Bx(.2,.1,z0+.28,.18,.02,.1,[0,0,-.2],0xdc2626);Bx(.2,.09,z0+.28,.13,.025,.04,[0,0,-.2],0xffffff)},
   // 과속 송골매: 헬멧 + 눈물 줄무늬 + 속도선
   falcon(){Hm(0,hy,hz+.01,hr+.012,UP,0x475569);sides(s=>{Bx(s*.075,-.42,hz-.03,.02,.02,.09,[0,s*.1,0],0x1f2937);Bx(s*.12,.5,z0+.1,.012,.35,.012,O,0xe0f2fe,1)});Bx(0,.55,z0+.02,.012,.4,.012,O,0xe0f2fe,1);
    [0,1,2].forEach(i=>Bx(0,-.3,z0+.09-i*.06,.14-i*.025,.02,.015,O,0x44403c))},
   // 시급 알바트로스: 알바 모자 + 명찰
   albatross(){Hm(0,hy,hz+.01,hr+.012,UP,0xdc2626);Bx(0,hy-.14,hz+.07,.17,.1,.015,O,0xdc2626);Bx(.1,-.31,z0,.07,.015,.045,O,0xffffff);Su(.1,-.32,z0+.005,.012,0xef4444)},
   // 야근 올빼미: 넥타이 + 커피잔 + 가슴 깃털
   owl(){const lc=mxc(c,0xffffff,.45);[[0,.1],[-.1,.1],[.1,.1],[-.14,0],[-.05,0],[.05,0],[.14,0]].forEach(([x,dz])=>S(x,fy(x,z0+dz)+.012,z0+dz,.05,.04,.04,lc));
    Bx(0,-.33,z0+.02,.055,.02,.14,O,0x92400e);[0,1,2].forEach(i=>Bx(0,-.342,z0-.02+i*.045,.056,.004,.01,[0,.5,0],0x451a03));Su(0,-.333,z0+.1,.03,0x78350f);
    Y(-.22,-.37,z0-.08,.08,.15,UP,0xd6a77a);Y(-.22,-.37,z0,.07,.012,UP,0x3b1d0a);T(-.31,-.37,z0-.08,.045,.012,[0,PI/2,0],0xd6a77a);[0,1,2].forEach(i=>Su(-.22+(i-1)*.025,-.37,z0+.06+i*.05,.016,0xffffff,1))},
   // 정전 천둥새: 먹구름 모자 + 전기 플러그 꼬리
   thunderbird(){Su(0,hy,zt+.04,.1,0x94a3b8);Su(-.07,hy+.02,zt+.03,.07,0xcbd5e1);Su(.07,hy+.02,zt+.03,.07,0xcbd5e1);
    Bx(0,.47,z0+.1,.08,.1,.045,O,0x374151);sides(s=>Bx(s*.022,.55,z0+.1,.012,.05,.02,O,0xd1d5db));
    Bx(0,-.31,z0+.05,.04,.012,.1,[0,0,.5],0xfde047,1);Bx(0,-.31,z0-.04,.04,.012,.1,[0,0,-.5],0xfde047,1)},
   // 대머리 독수리: 흰머리 + 목 털옷
   eagle(){Su(-.04,hy+.02,zt+.0,.065,0xffffff);Su(.04,hy+.0,zt+.0,.06,0xffffff);Su(0,hy+.05,zt-.01,.06,0xffffff);T(0,hy+.1,hz-.13,.15,.045,O,0xffffff)},
   // 부활절 불사조: 토끼 귀 + 불꽃 꼬리 + 금빛 가슴
   phoenix(){S(0,-.14,z0,.2,.19,.18,0xfde047);sides(s=>{S(s*.075,hy+.02,zt+.12,.035,.03,.13,0xfb923c,0,[0,s*.25,0]);S(s*.075,hy-.0,zt+.12,.02,.012,.1,0xf9a8d4,0,[0,s*.25,0])});
    K(0,.52,z0+.14,.07,.34,BK,0xf97316,1);K(0,.62,z0+.14,.045,.3,BK,0xfde047,1);sides(s=>K(s*.09,.46,z0+.2,.045,.26,[0,0,s*.35],0xef4444,1))},
   // 근육 타조: 땀받이 + 알통 + 아령
   ostrich(){const K2=0x1c1917,W=0xffffff,SK=0xf0b0a0,SK2=0xe0907e,PK=0xf472b6,PK2=0xdb2777,GD=0xfacc15;
    [[.25,.1,.78,.1],[-.25,.1,.78,.1],[0,.22,.8,.11],[.18,-.22,.74,.09],[-.18,-.22,.74,.09],[0,-.05,.85,.1],[.22,.25,.66,.09],[-.22,.25,.66,.09]].forEach(([x,y,z,r])=>Su(x,y,z,r,K2));
    sides(s=>{[[.33,.06,.68,.08],[.35,.16,.63,.065]].forEach(([x,y,z,r])=>Su(s*x,y,z,r,W));
     S(s*.15,.03,.4,.1,.11,.13,SK);Su(s*.15,-.02,.2,.045,SK2);Y(s*.15,-.01,.24,.032,.32,UP,SK2);Y(s*.15,-.02,.06,.028,.14,UP,PK);
     [.1,.15,.2].forEach((z,i)=>T(s*.15,-.01,z,.036,.008,[.25*(i%2?1:-1),0,0],PK2));S(s*.15,-.1,.02,.035,.11,.03,PK);
     [-.03,0,.03].forEach((d,i)=>Bx(s*(.08+d),hy-.1,hz+.115+(i===1?.012:0),.008,.008,.04,[0,0,s*(.4-i*.35)],0x111827))});
    S(0,0,.5,.5,.56,.05,PK);S(0,0,.55,.44,.5,.045,0xf9a8d4);S(0,0,.45,.54,.6,.03,PK2);for(let i=0;i<18;i++){const a=i*PI/9;S(Math.cos(a)*.5,Math.sin(a)*.56,.47,.07,.07,.05,i%2?PK:0xf9a8d4)}sides(s=>{T(s*.15,-.04,.045,.045,.01,[PI/2,0,0],PK2);Bx(s*.15,-.13,.025,.02,.03,.02,O,PK2)});
    for(let i=0;i<5;i++){const a=(i-2)*.38;K(Math.sin(a)*.13,hy-Math.cos(a)*.06,zt+.02,.022,.07+(i===2?.04:0),[PI/2,0,-a*.6],GD)}Su(0,hy-.07,zt+.05,.025,PK2,1);
    [[0,.42,.82,.13],[.12,.44,.76,.1],[-.12,.44,.76,.1],[0,.5,.7,.09]].forEach(([x,y,z,r])=>Su(x,y,z,r,W))},
   // 🏗 철거반장 두루미: 노란 안전모 + 주황 안전 조끼(반사띠) + 무전기
   demcrane(){Hm(0,hy,zt-.05,.15,UP,0xfacc15);Y(0,hy-.02,zt-.045,.2,.014,UP,0xeab308);Bx(0,hy-.15,zt-.03,.05,.012,.03,O,0x111827);
    S(0,-.2,z0+.01,.24,.16,.2,0xf97316);[-.04,.05].forEach(dz=>S(0,-.215,z0+dz,.245,.15,.018,0xf1f5f9));Bx(.2,-.12,z0+.12,.05,.035,.09,O,0x111827);K(.215,-.12,z0+.2,.008,.08,UP,0x111827);
    K(0,.36,z0+.02,.08,.22,[-.3,0,0],0x1f2937)},
   // 🦖 시조새: 이빨 난 부리 + 뼈 꼬리 양옆 깃털 + 날개 발톱 + 붉은 볏
   archaeo(){[[.12,-.1,.08,.5],[-.1,.06,.12,-.7],[.05,.18,.04,.2],[-.14,-.18,0,1.1]].forEach(([x,y,dz,r])=>Bx(x,y,z0+.2+dz,.13,.012,.012,[0,0,r],0x2f2a24));
    for(let i=0;i<4;i++)sides(sd=>Bx(sd*.13,-.06+i*.07,z0+.17,.1,.012,.012,[0,0,sd*.35],0xe8dfc8));Bx(0,.02,z0+.2,.012,.32,.012,O,0xe8dfc8);
    [[.16,.12],[-.12,-.2],[.02,.3]].forEach(([x,y])=>S(x,y,z0+.2,.045,.045,.016,0x6b8e3a));[[.2,.32],[-.18,.36],[.08,.42]].forEach(([x,y])=>S(x,y,z0-.08,.025,.025,.02,0x8f8676));
    for(let i=-2;i<=2;i++)K(i*.026,hy-hr-.06,hz-.04,.014,.05,DN,0xffffff);[-2,-1,0,1,2].forEach(i=>K(i*.03,hy+.04-Math.abs(i)*.02,zt+.02,.026,.15-Math.abs(i)*.03,[PI/2-.3,0,i*.35],i%2?0x8f8676:0xb0a793));
    for(let i=0;i<6;i++){const y=.3+i*.085,z=z0+.04-i*.012;S(0,y,z,.028,.045,.026,c);sides(sd=>S(sd*.055,y,z,.055,.022,.012,i%2?0x6e665a:0x8f8676,0,[0,0,sd*.35]))}
    sides(sd=>[0,1,2].forEach(i=>K(sd*(.31+i*.02),-.08-i*.03,z0+.12,.01,.05,[0,0,sd*1.2],0xf5f5f4)))},
   // 🦖 갓 깨어난 시조새: 청록 깃털(돌 무늬가 남음) + 깨진 화석 껍질 모자 + 등에 돌조각
   archaeo_g(){for(let i=-2;i<=2;i++)K(i*.024,hy-hr-.05,hz-.035,.011,.035,DN,0xffffff);/* 화석 껍질 모자 */S(0,hy+.03,hz+.07,.17,.17,.1,0x827c72);for(let i=0;i<9;i++){const a=i/9*PI*2;K(Math.cos(a)*.155,hy+.03+Math.sin(a)*.155,hz+.1,.03,.07,O,i%2?0x9c968b:0x67625a)}Bx(.05,hy+.06,hz+.15,.07,.01,.01,[0,0,.6],0x2f2a24);S(-.06,hy-.02,hz+.14,.03,.03,.012,0x6b8e3a);/* 등에 붙은 돌 조각 */[[.1,.08,.4],[-.09,.2,-.5],[.02,-.08,1.2]].forEach(([x,y,r])=>Bx(x,y,z0+.2,.09,.07,.03,[0,.3,r],0x827c72));Bx(.1,.08,z0+.22,.06,.008,.008,[0,0,1],0x2f2a24);/* 새 깃털 꼬리 */for(let i=0;i<6;i++){const y=.3+i*.085,z=z0+.04-i*.012;S(0,y,z,.028,.045,.026,c);sides(sd=>S(sd*.06,y,z,.06,.024,.012,i%2?0xf59e0b:0x14b8a6,0,[0,0,sd*.35]))}sides(sd=>[0,1,2].forEach(i=>K(sd*(.31+i*.02),-.08-i*.03,z0+.12,.01,.05,[0,0,sd*1.2],0xf5f5f4)));belly(0xfde68a,.85);Su(.15,hy+.06,hz+.02,.03,0xffffff,1)},
   // 온천욕 두루미: 머리 수건 + 김
   crane(){Bx(0,hy,zt+.0,.2,.14,.05,O,0xffffff);Bx(0,hy-.04,zt+.0,.202,.025,.052,O,0x38bdf8);S(0,hy-.1,hz+.05,.05,.025,.035,0xdc2626);
    [[.18,-.1,zt+.2,.04],[-.15,-.05,zt+.3,.05],[.1,.05,zt+.42,.035]].forEach(([x,y,z,r])=>Su(x,y,z,r,0xffffff,1));K(0,.36,z0+.02,.08,.22,[-.3,0,0],0x1f2937)},
   // 고속충전 불새: 배터리 + 안테나 + 플러그 꼬리
   plasmabird(){Bx(0,-.32,z0,.14,.03,.09,O,0x1f2937);Bx(0,-.32,z0+.065,.04,.03,.02,O,0x9ca3af);[-1,0,1].forEach(i=>Bx(i*.04,-.338,z0,.03,.01,.06,O,0x4ade80,1));
    sides(s=>{K(s*.06,hy,zt,.012,.14,[PI/2,0,-s*.3],0x9ca3af);Su(s*.105,hy,zt+.065,.02,0xfde047,1)});Bx(0,.48,z0+.1,.08,.1,.045,O,0x374151);sides(s=>Bx(s*.022,.56,z0+.1,.012,.05,.02,O,0xd1d5db))},
   // 퀵배달 혜성매: 택배 상자 + 배달 모자 + 불꽃 꼬리
   comet(){Bx(0,.08,z0+.35,.26,.28,.2,O,0xd6a35c);Bx(0,.08,z0+.35,.05,.285,.204,O,0xfde68a);Hm(0,hy,hz+.01,hr+.012,UP,0x2563eb);Bx(0,hy-.14,hz+.07,.16,.09,.015,O,0x2563eb);
    K(0,.62,z0+.1,.1,.5,BK,0xf97316,1);K(0,.66,z0+.1,.06,.42,BK,0xfde047,1)},
   // 재채기 까마귀: 얼음주머니 + 콧물방울 + 체온계
   plague(){Bx(0,hy+.01,zt,.15,.12,.04,O,0x93c5fd);Bx(0,hy+.01,zt+.022,.03,.09,.01,O,0xffffff);Bx(0,hy+.01,zt+.022,.09,.03,.01,O,0xffffff);
    [[-.05,-.58,.4,.02],[0,-.62,.34,.026],[.05,-.58,.3,.018]].forEach(([x,y,z,r])=>Su(x,y,z,r,0x86efac,1));Bx(.05,-.5,.38,.012,.16,.012,[0,0,.25],0xf1f5f9)},
   // 오로라 덕후: 카메라 + 오로라 띠
   auroraowl(){Bx(0,-.33,z0,.13,.07,.09,O,0x111827);Y(0,-.375,z0,.035,.03,O,0x64748b);S(0,-.392,z0,.025,.01,.025,0x93c5fd,1);Su(.05,-.33,z0+.055,.015,0xffffff,1);
    [[-.3,-.3,.9],[.3,.1,.95],[0,-.5,.85]].forEach(([x,y,z])=>Su(x,y,z,.02,0xffffff,1))},
   // 눈사람 갈매기: 단추 + 목도리 + 양동이 모자
   blizgull(){[.12,.03,-.06].forEach(dz=>Su(0,fy(0,z0+dz)+.01,z0+dz,.025,0x1f2937));T(0,hy+.07,hz-.13,.16,.035,O,0xdc2626);Bx(.1,-.3,.33,.05,.03,.14,O,0xdc2626);
    Y(0,hy,zt+.03,.1,.1,UP,0x6b7280);T(0,hy,zt+.08,.1,.015,O,0x4b5563)},
   // 냉동 펭귄단: 고드름 볏 + 얼음 조각
   frostpeng(){[-1,0,1].forEach(i=>K(i*.05,hy,zt,.03,.14-Math.abs(i)*.03,[PI/2,0,i*.3],0x7dd3fc));sides(s=>Bx(s*.25,-.05,.55,.09,.09,.09,[.3,.4,.2],0xddd6fe));
    T(0,-.03,.6,.165,.04,O,0x7c3aed);[[.07,-.26,.42,.022],[.1,-.25,.33,.016]].forEach(([x,y,z,r])=>Su(x,y,z,r,0xa3e635,1));Bx(0,hy-.02,zt+.04,.16,.16,.07,O,0xdbeafe)},
   // 태풍 독수리: 먹구름 + 소용돌이
   stormeagle(){Su(0,hy,zt+.04,.1,0x64748b);Su(-.07,hy+.02,zt+.03,.07,0x94a3b8);Su(.07,hy+.02,zt+.03,.07,0x94a3b8);[[-.32,.05,z0+.1],[.3,-.05,z0+.15],[0,.35,z0+.05]].forEach(([x,y,z])=>Bx(x,y,z,.025,.02,.09,[0,x*2,0],0xfde047,1))},
   // 보조배터리 박쥐: 뾰족 귀 + 보조배터리 + 충전선
   voltbat(){sides(s=>{K(s*.11,hy+.02,zt,.05,.2,[PI/2,0,-s*.25],0x365314);K(s*.03,hy-.2,hz-.1,.012,.05,DN,0xffffff)});Bx(0,.08,z0+.27,.2,.3,.07,O,0x374151);
    [-1,0,1].forEach(i=>Su(i*.05,-.03,z0+.31,.012,0x4ade80,1));Bx(0,.14,z0+.31,.05,.1,.01,O,0xfde047,1);T(0,.4,z0,.07,.01,[PI/2,0,0],0x111827)},
   // 투명망토 까마귀: 마법사 모자
   ghostcrow(){S(0,.14,z0+.03,.28,.06,.24,0x5b21b6,0,[.55,0,0]);S(0,.15,z0+.035,.24,.05,.2,0x7c3aed,0,[.55,0,0]);[[.2,.3,z0+.2],[-.22,.25,z0+.1],[.05,.4,z0+.28]].forEach(([x,y,z])=>Su(x,y,z,.018,0xfde047,1));K(.02,hy,zt+.12,.13,.26,[PI/2,0,.2],0x6d28d9);Y(0,hy,zt-.035,.19,.015,UP,0x5b21b6);Y(0,hy,zt-.01,.12,.03,UP,0xfbbf24);Su(0,hy-.1,zt+.1,.025,0xfde047,1)}
  };

  const TOA=(t,arc)=>new THREE.TorusGeometry(1,t,6,18,arc||PI*2),dirE=(b0,d)=>{const q=new THREE.Quaternion().setFromUnitVectors(b0,d.clone().normalize()),e=new THREE.Euler().setFromQuaternion(q);return[e.x,e.y,e.z]},
   str=(x1,y1,z1,x2,y2,z2,col)=>{const d=V3(x2-x1,y2-y1,z2-z1),L=d.length();P.push([BG(),(x1+x2)/2,(y1+y2)/2,(z1+z2)/2,.006,.006,L,...dirE(V3(0,0,1),d),col])};
  if(id==='hatch_chick'){hat();cup();// 갓깬: 머리 위 물음표 + 식은땀
   G.push([TOA(.22,PI*1.3),ox+.17,oy,oz+.2,.045,.045,.045,PI/2,0,-.6,0xfde047]);G.push([BG(),ox+.165,oy,oz+.12,.018,.018,.04,0,0,0,0xfde047]);G.push([SG(),ox+.165,oy,oz+.075,.016,.016,.016,0,0,0,0xfde047]);
   G.push([SG(),-.19,H.hy-.02,H.hz+.08,.022,.022,.035,0,0,0,0x7dd3fc])}
  else if(id==='hatch_fire'){cup(0xa0612b);// 맥반석: 구운 껍데기 + 찜질방 양머리 수건 + 김
   [-1,1].forEach(s=>{P.push([TOA(.55),s*.165,H.hy+.01,H.hz+.11,.075,.075,.075,0,PI/2,0,0xf9a8d4]);P.push([SG(),s*.165,H.hy+.01,H.hz+.11,.05,.06,.06,0,0,0,0xf472b6])});
   P.push([new THREE.SphereGeometry(1,12,5,0,PI*2,0,PI*.42),0,H.hy,H.hz+.04,.2,.2,.2,PI/2,0,0,0xf9a8d4]);
   [[.12,.0,.25,.04],[-.1,.05,.33,.05],[.05,.08,.42,.035]].forEach(([x,y,z,r])=>G.push([SG(),ox+x,oy+y,oz+z,r,r,r,0,0,0,0xffffff]));G.push([SG(),.2,H.hy+.02,H.hz-.02,.02,.02,.032,0,0,0,0x7dd3fc])}
  else if(id==='hatch_ice'){cup(0xd9a066);for(let i=0;i<6;i++)P.push([BG(),0,0,.12,.62,.008,.008,0,0,i*PI/6+.3,0xa16207]);// 아이스: 와플콘 껍데기 + 소프트아이스크림 + 체리
   [[.12,0,0xfdf2f8],[.095,.045,0xf9a8d4],[.07,.085,0xfdf2f8],[.045,.12,0xf9a8d4]].forEach(([r,z,cc])=>P.push([TOA(.45),ox,oy,oz-.01+z,r,r,r*.9,0,0,0,cc]));P.push([KG(),ox,oy,oz+.16,.035,.07,.035,PI/2,0,0,0xfdf2f8]);
   P.push([SG(),ox+.02,oy,oz+.2,.028,.028,.028,0,0,0,0xdc2626]);[[.08,.03,.0,0xfde047],[-.07,-.04,.05,0x60a5fa],[.03,-.08,.09,0x4ade80],[-.05,.06,.1,0xf472b6]].forEach(([x,y,z,cc])=>G.push([BG(),ox+x,oy+y,oz+z,.025,.008,.008,0,0,x*20,cc]))}
  else if(id==='hatch_thunder'){cup();// 찌릿: 정전기로 뻗친 머리 + 번개
   for(let i=0;i<11;i++){const a=i*2.4,e=.25+(i%4)*.25,dx=Math.cos(a)*Math.cos(e),dy=Math.sin(a)*Math.cos(e),dz=Math.sin(e);P.push([KG(),H.hr*.9*dx,H.hy+H.hr*.9*dy,H.hz+H.hr*.9*dz+.02,.03,.13,.03,...dirE(V3(0,1,0),V3(dx,dy,dz)),0xfef08a])}
   [[0,.06,.35],[.025,.12,-.5],[-.005,.18,.35]].forEach(([x,z,r])=>G.push([BG(),ox+x,oy,oz+z+.04,.035,.03,.08,0,r,0,0xfde047]));[[.22,.05,.5],[-.2,-.05,.55],[.15,-.2,.65]].forEach(([x,y,z])=>G.push([SG(),x,y,z,.018,.018,.018,0,0,0,0xfef9c3]))}
  else if(id==='hatch_wind'){// 풍선: 풍선 두 개 더(가운데 하나는 팀 색, 3D 쪽에서) + 줄
   [[-.24,.02,1.05,.12,0xf43f5e],[.24,.06,1.0,.12,0xfacc15]].forEach(([x,y,z,r,cc])=>{P.push([SG(),x,y,z,r,r,r*1.15,0,0,0,cc]);P.push([SG(),x-.04,y-.05,z+.06,.025,.025,.025,0,0,0,0xffffff]);str(0,oy+.12,oz-.04,x,y,z-r*1.1,0xe5e7eb)});
   str(0,oy+.12,oz-.04,0,.12,1.02,0xe5e7eb);G.push([SG(),.22,.1,H.z0,.02,.02,.02,0,0,0,0xffffff])}
  else if(id==='hatch_dark'){// 방귀: 기저귀 + 엉덩이 쪽 초록 구름 + 냄새 선
   P.push([new THREE.SphereGeometry(1,12,6,0,PI*2,PI*.5,PI*.5),0,.03,.22,.3,.3,.22,PI/2,0,0,0xf8fafc]);[-1,1].forEach(s=>P.push([BG(),s*.28,-.08,.2,.025,.07,.06,0,0,0,0x60a5fa]));P.push([SG(),0,-.22,.2,.035,.012,.035,0,0,0,0xfde047]);
   [[0,.36,.24,.07],[.09,.46,.3,.055],[-.07,.52,.34,.045],[.03,.6,.42,.035]].forEach(([x,y,z,r])=>G.push([SG(),x,y,z,r,r,r,0,0,0,0xa3e635]));[-1,0,1].forEach(i=>G.push([BG(),i*.06,.42,.5+Math.abs(i)*.03,.012,.012,.1,0,i*.3,0,0x84cc16]))}
  else if(id==='hatch_gold'){cup(0xfacc15);P.push([YG(),ox,oy,oz+.02,.1,.06,.1,PI/2,0,0,0xfacc15]);for(let i=0;i<5;i++){const a=i*PI*2/5;P.push([KG(),ox+Math.cos(a)*.085,oy+Math.sin(a)*.085,oz+.09,.025,.07,.025,PI/2,0,0,0xfacc15]);G.push([SG(),ox+Math.cos(a)*.085,oy+Math.sin(a)*.085,oz+.13,.014,.014,.014,0,0,0,i%2?0xff6b9a:0x7dd3fc])}
   [[.27,-.12,.45],[-.26,.05,.55],[.2,.15,.62],[-.15,-.25,.3]].forEach(([x,y,z],i)=>{G.push([BG(),x,y,z,.012,.012,.07,0,0,0,0xfffbeb]);G.push([BG(),x,y,z,.07,.012,.012,0,0,0,0xfffbeb])});
   [0,1,2].forEach(i=>P.push([YG(),.28,-.05,.04+i*.025,.06,.02,.06,PI/2,0,0,i%2?0xeab308:0xfacc15]))}
  else if(id==='hatch_dino'){for(let i=0;i<5;i++){const y=-.12+i*.11,z=H.z0+.24-Math.abs(y-.05)*.25;P.push([KG(),0,y,z,.06-i*.004,.15-i*.01,.025,PI/2,0,0,i%2?0xfb923c:0xa3e635])}
   P.push([KG(),0,.42,.2,.11,.36,.08,-.25,0,PI,c]);[-1,1].forEach(s=>{P.push([YG(),s*.14,-.24,.24,.025,.12,.025,1.1,0,0,c]);P.push([KG(),s*.028,H.hy-H.hr-.03,H.hz-.07,.014,.035,.014,-PI/2,0,0,0xffffff])});
   P.push([SG(),0,-.16,H.z0-.02,.17,.15,.16,0,0,0,0xfde68a]);hat()}
  else if(id==='eggchief'){const BK=0x18181b,GLD=0xf5c542,hy=H.hy,hz=H.hz,zt=H.hz+H.hr;[-1,1].forEach(s=>{
    P.push([YG(),s*.11,-.02,.06,.065,.16,.065,PI/2,0,0,0xf59e0b]);P.push([SG(),s*.11,-.1,.0,.08,.11,.03,0,0,0,0xf59e0b]);// 굵은 다리
    P.push([SG(),s*.3,-.02,.32,.06,.14,.1,0,0,0,c])});// 접은 날개
   P.push([YG(),0,hy+.01,zt-.005,.175,.016,.175,PI/2,0,0,BK]);P.push([YG(),0,hy+.01,zt+.1,.11,.2,.11,PI/2,0,0,BK]);P.push([YG(),0,hy+.01,zt+.025,.113,.035,.113,PI/2,0,0,0x7f1d1d]);// 실크햇
   P.push([new THREE.TorusGeometry(1,.12,6,18),.08,hy-.115,hz+.06,.05,.05,.05,PI/2,0,0,GLD]);P.push([BG(),.12,hy-.1,hz-.06,.008,.008,.2,0,.3,0,GLD]);// 외알 안경 + 줄
   P.push([BG(),0,-.36,.4,.1,.03,.06,0,0,0,0x7f1d1d]);P.push([SG(),0,hy-.17,hz-.12,.035,.03,.06,0,0,0,0xdc2626]);[-.05,0,.05].forEach(x=>P.push([SG(),x,hy-.08,zt-.02,.035,.03,.04,0,0,0,0xdc2626]));P.push([SG(),.27,-.2,.36,.1,.1,.13,.2,0,0,0xfacc15]);P.push([SG(),.25,-.27,.4,.03,.02,.04,0,0,0,0xfff7c2]);P.push([SG(),.3,-.15,.32,.06,.08,.05,0,0,0,c]);[-1,1].forEach(s=>P.push([KG(),s*.05,-.37,.4,.035,.06,.02,0,0,s*PI/2,0x991b1b]));// 금목걸이 + 나비넥타이
   }// 황금알은 날개로 들고 있어요
  else if(D[id])D[id]();
  return[P,G]}
 const BMAT=()=>mat('face',()=>basic(0xffffff,{vertexColors:true})),SMAT=()=>mat('soft',()=>basic(0xffffff,{vertexColors:true,transparent:true,opacity:.36,depthWrite:false})),
  AMAT=()=>mat('acc',()=>std(0xffffff,{vertexColors:true,roughness:.6,flatShading:false})),GMAT=()=>mat('accG',()=>basic(0xffffff,{vertexColors:true}));
 const OUTL={crow:1,vampire:1,plague:1,voltbat:1,pirate:1,woodpecker:1,frostpeng:1,eagle:1,ghostcrow:0};
 // ---------- 🎬 움직이는 시그니처 파츠(공작 부채·백조 발장구·도도 불꽃) + 펭귄 덜덜 ----------
 const ANP={};
 function animSet(id,H){if(id in ANP)return ANP[id];const z0=H.z0,L=[],SPH=()=>new THREE.SphereGeometry(1,16,12),CON=()=>new THREE.ConeGeometry(1,1,14),CYL=()=>new THREE.CylinderGeometry(1,1,1,12);
  if(id==='peacock'){const P=[],G=[],n=9,Ln=.64;
   for(let i=0;i<n;i++){const a=(i-(n-1)/2)*.3,sx=Math.sin(a),cz=Math.cos(a),r=[0,a,0];
    P.push([SPH(),sx*Ln/2,0,cz*Ln/2,.088,.02,Ln/2,...r,i%2?0x0f766e:0x15803d]);
    P.push([SPH(),sx*Ln*.46,-.014,cz*Ln*.46,.05,.02,Ln*.34,...r,0x2dd4bf]);
    P.push([SPH(),sx*Ln*.8,-.026,cz*Ln*.8,.062,.014,.074,...r,0xfacc15]);
    P.push([SPH(),sx*Ln*.8,-.036,cz*Ln*.8,.042,.014,.052,...r,0x1d4ed8]);
    G.push([SPH(),sx*Ln*.8,-.045,cz*Ln*.8,.018,.01,.022,...r,0x67e8f9])}
   L.push({pos:[0,.22,z0+.04],rot:[-.45,0,0],P,G,k:'fan',kk:'fan'})}
  else if(id==='swan'){const P=[[CYL(),0,0,-.1,.014,.2,.014,PI/2,0,0,0xf97316],[SPH(),0,-.045,-.215,.055,.085,.014,0,0,0,0xf97316],[SPH(),0,-.05,-.208,.036,.06,.01,0,0,0,0xfdba74]];
   [-1,1].forEach(s=>L.push({pos:[s*.09,.06,z0-.17],rot:[0,0,0],P,G:[],k:'leg'+s,kk:'leg'}))}
  else if(id==='humbee'){[-1,1].forEach(s=>L.push({pos:[s*.07,.04,z0+.2],rot:[0,0,0],P:[],G:[[SPH(),s*.17,.02,.1,.18,.07,.012,0,s*.35,0,0x7dd3fc],[SPH(),s*.12,.1,.05,.11,.05,.01,0,s*.35,0,0xbae6fd]],k:'bz'+s,kk:'bz'+s}))}
  else if(id==='crocbird'){const P=[[SPH(),0,-.2,-.035,.15,.25,.055,0,0,0,0x66bb6a],[SPH(),0,-.2,-.06,.13,.22,.04,0,0,0,0xf3e9b0],[SPH(),0,-.2,.0,.12,.21,.03,0,0,0,0xe57373],[SPH(),0,-.14,.02,.07,.13,.025,0,0,0,0xf48fb1]];for(let i=0;i<5;i++)[-1,1].forEach(s=>P.push([CON(),s*.09,-.06-i*.06,.03,.014,.045,.014,PI/2,0,0,0xffffff]));
   L.push({pos:[0,-.42,.12],rot:[0,0,0],P,G:[],k:'jaw',kk:'jaw'})}
  else if(id==='egg_legs'){const OR=0xfb923c,P=[[CYL(),0,0,-.11,.022,.22,.022,PI/2,0,0,OR],[CYL(),0,0,-.065,.032,.07,.032,PI/2,0,0,0xffffff],[CYL(),0,0,-.085,.033,.014,.033,PI/2,0,0,0xef4444],[CYL(),0,0,-.055,.033,.012,.033,PI/2,0,0,0x3b82f6],
    [SPH(),0,-.035,-.23,.058,.078,.034,0,0,0,OR],[SPH(),.032,-.095,-.235,.024,.024,.022,0,0,0,OR],[SPH(),-.032,-.095,-.235,.024,.024,.022,0,0,0,OR],[SPH(),0,-.105,-.235,.024,.024,.022,0,0,0,OR],[SPH(),0,0,0,.034,.034,.034,0,0,0,0xffffff]];
   [-1,1].forEach(s=>L.push({pos:[s*.085,.0,z0-.21],rot:[0,0,0],P,G:[],k:'wk'+s,kk:'eleg'}))}
  return ANP[id]=L.length?L:null}
 function animAdd(m,b,H,st,cl){const id=b.id,an=animSet(id,H);let gs=[];
  if(an)gs=an.map(a=>{const q=new THREE.Group();q.name='artAnim';q.position.set(...a.pos);q.rotation.set(...a.rot);q.userData.k=a.k;
   if(a.P.length){const o=new THREE.Mesh(gk('anP_'+id+a.kk,()=>merge(a.P)),cl(AMAT()));o.name='artAnimP';q.add(o);if(st)fadeSt(o,m)}
   if(a.G.length){const o=new THREE.Mesh(gk('anG_'+id+a.kk,()=>merge(a.G)),cl(GMAT()));o.name='artAnimG';q.add(o);if(st)fadeSt(o,m)}
   m.add(q);return q});
  const shiv=id==='penguin',peck=id==='woodpecker',dance=id==='dodo',ballet=id==='ostrich';if(!gs.length&&!shiv&&!peck&&!dance&&!ballet)return;
  m.userData.an=(t,mm)=>{if(shiv){mm.position.x+=Math.sin(t*61)*.016;mm.position.y+=Math.cos(t*47)*.009}
   if(dance){mm.rotation.y=Math.sin(t*5)*.2;mm.position.z+=Math.abs(Math.sin(t*5))*.03}
   // 🩰 발레 타조: 살랑살랑 걷다가 2.6초마다 발끝으로 서서 빙글 한 바퀴(피루엣). 바깥에서 방향을 정해 줘도(광장) 그 위에 더해서 돌아요
   if(ballet){const ph=t%2.6,sp=ph<.9?(1-Math.cos(ph/.9*Math.PI))/2*6.2832:0,ud=mm.userData;if(ud.rzl===undefined||Math.abs(mm.rotation.z-ud.rzl)>1e-6)ud.rzb=mm.rotation.z;
    mm.rotation.z=ud.rzb+sp;ud.rzl=mm.rotation.z;mm.rotation.y=ph<.9?0:Math.sin(t*4)*.14;mm.position.z+=ph<.9?Math.sin(ph/.9*Math.PI)*.12:Math.abs(Math.sin(t*4))*.02}
   if(peck){const ph=t%1.8;mm.rotation.x=ph<.55?Math.abs(Math.sin(ph*34))*.3:0}
   for(const q of gs){const k=q.userData.k;
    if(k==='fan'){const s=1+.07*Math.sin(t*3.2);q.scale.set(s,1,s);q.rotation.y=Math.sin(t*1.7)*.07}
    else if(k==='fire')q.scale.set(1+.05*Math.sin(t*17),1,1+.2*Math.sin(t*13)+.08*Math.sin(t*31));
    else if(k[0]==='b'&&k[1]==='z')q.rotation.y=(k==='bz1'?-1:1)*(.15+Math.sin(t*58)*.45);
    else if(k==='jaw')q.rotation.x=.12+.3*Math.max(0,Math.sin(t*3.2));
    else if(k[0]==='w'){q.rotation.x=Math.sin(t*11+(k==='wk1'?PI:0))*.5;q.position.z=H.z0-.21+Math.max(0,Math.sin(t*11+(k==='wk1'?PI:0)))*.025}
    else q.rotation.x=Math.sin(t*26+(k==='leg1'?PI:0))*.8}}}

 const ACG={};function accGeo(b,H){let r=ACG[b.id];if(!r){const[P,G]=accParts(b,H),mk=(k,L)=>L.length?gk(k+b.id,()=>merge(L)):null;r=ACG[b.id]={p:mk('acc_',P),g:mk('accG_',G)}}return r}
 const fadeSt=(o,m)=>{o.onBeforeRender=()=>{o.material.transparent=true;o.material.opacity=m.userData.st?.3:1}};
 A.bird=({m,b,u,dex})=>{if(!m||!b||typeof GC==='undefined')return;const id=b.id,sc0=m.scale.y||1,air=b.t==='A',H=headOf(id);
  const ek=Math.max(1,Math.min(1.4,1.42-(sc0-.7)*.55));// 작은 새일수록 눈이 큼(아기 비율)
  const ev=findEyes(m,id);ev.forEach(o=>o.scale.multiplyScalar(ek));
  let eyes=ev.map(o=>[o.position.x,o.position.y,o.position.z,o.geometry.parameters.radius*o.scale.x/ek]),ekey=eyes.map(e=>e.map(v=>v.toFixed(2)).join(',')).join(';');
  {const fv=FV[id]||(FV[id]={});if(!fv[ekey]){const ks=Object.keys(fv);if(ks.length>=4){ekey=ks[0];eyes=fv[ekey]}else fv[ekey]=eyes}}// 눈 배치가 매번 달라도 캐시 변형은 종류당 최대 4개(누수 방지)
  const st=!!b.stealth,cl=mm=>st?mm.clone():mm;// 은신 새는 투명도가 바뀌므로 재질 복제(복제본은 rmM이 정상 해제)
  const add=(g,mm,name)=>{const o=new THREE.Mesh(g,cl(mm));o.name=name;m.add(o);return o};
  {const fo=add(gk('face_'+id+'_'+ek.toFixed(2)+'_'+ekey,()=>merge(faceParts(id,eyes,ek,H))),BMAT(),'artFace');if(st)fadeSt(fo,m)}
  // 반투명: 등 광택 + 바닥 그림자(공중 새는 땅에 그림자 → 높이감). 도감엔 그림자 없음
  const gz=((air?-1.4:-.05)+.035)/sc0;
  const so=add(gk('soft_'+id+(dex?'_d':'_'+sc0.toFixed(2)),()=>merge([[SG(),.075,-.07,H.z0+.222,.085,.11,.025,0,0,-.5,0xffffff]].concat(dex?[]:[[CG(),.06,-.06,gz,.27,.32,1,0,0,0,0x000000]]))),SMAT(),'artSoft');if(st)so.onBeforeRender=()=>{so.material.transparent=true;so.material.opacity=m.userData.st?.12:.36};
  if(!H.egg&&OUTL[id]!==0){const b0=m.children[0],r0=(b0&&b0.geometry&&b0.geometry.parameters&&b0.geometry.parameters.radius)||.26,bp=b0?b0.position:V3(0,0,H.z0),bs=b0?b0.scale:V3(1,1,1),e=.016;
   const og=gk('outl2_'+id,()=>merge([[new THREE.SphereGeometry(1,16,12),bp.x,bp.y,bp.z,r0*bs.x+e*2.2,r0*bs.y+e*2.2,r0*bs.z+e*2.2,0,0,0,0x141420],[new THREE.SphereGeometry(1,14,10),0,H.hy,H.hz,H.hr+e*1.6,H.hr+e*1.6,H.hr+e*1.6,0,0,0,0x141420]]));
   const oo=add(og,mat('outl',()=>basic(0xffffff,{vertexColors:true,side:THREE.BackSide})),'artOutl');if(st)fadeSt(oo,m)}
  animAdd(m,b,H,st,cl);
  {const ag=accGeo(b,H);if(ag.p){const o=add(ag.p,AMAT(),'artAcc');if(st)fadeSt(o,m)}if(ag.g){const o=add(ag.g,GMAT(),'artAccG');if(st)fadeSt(o,m)}}
  if(dex&&!air&&!H.egg&&id!=='eggchief'&&id!=='crocbird'&&id!=='ostrich'){const ft=mat('foot',()=>std(0xf59e0b,{flatShading:false,roughness:.6}));[-1,1].forEach(s=>{const o=new THREE.Mesh(gk('hlS',()=>new THREE.SphereGeometry(1,10,6)),ft);o.position.set(s*.1,-.08,-.02);o.scale.set(.06,.085,.03);m.add(o)})}};

 // ---------- 🏗️ 타워 모델: 이름 맞춤 디자인 + 강화 Lv.1~4 진화 ----------
 // (종류,레벨)마다 부품을 재질 종류별 지오메트리 1개로 합쳐 캐시 → 타워 하나당 메시 3~12개(드로우콜 최소).
 // 재질은 공유 6종(s 기본·g 발광·t 유리·w 연기·a 더하기·x 전설 맥박) → 셰이더 프로그램 고정, rmM의 dispose는 무시됨.
 const TPR={};let TV=null;const tv=()=>TV||(TV={n:new THREE.Matrix3(),v:new THREE.Vector3(),p:new THREE.Vector3(),s:new THREE.Vector3(),q:new THREE.Quaternion(),e:new THREE.Euler(),z:new THREE.Vector3(0,0,1),d:new THREE.Vector3()});
 function tpr(k){if(TPR[k])return TPR[k];let g;const c=k[0],a=parseFloat(k.slice(1))||0;// 단위 원형(반지름 1, 높이 1, z가 위)
  if(c==='S')g=new THREE.SphereGeometry(1,10,7);else if(c==='s')g=new THREE.SphereGeometry(1,7,5);
  else if(c==='H'){g=new THREE.SphereGeometry(1,12,5,0,PI*2,0,PI/2);g.rotateX(PI/2)}
  else if(c==='B')g=new THREE.BoxGeometry(1,1,1);
  else if(c==='C'){g=new THREE.CylinderGeometry(1,1,1,12);g.rotateX(PI/2)}else if(c==='c'){g=new THREE.CylinderGeometry(1,1,1,6);g.rotateX(PI/2)}
  else if(c==='F'){g=new THREE.CylinderGeometry(a,1,1,12);g.rotateX(PI/2)}else if(c==='f'){g=new THREE.CylinderGeometry(a,1,1,6);g.rotateX(PI/2)}
  else if(c==='T')g=new THREE.TorusGeometry(1,a||.2,6,18);
  else if(c==='A'){const q=k.slice(1).split(',').map(Number);g=new THREE.TorusGeometry(1,q[0],6,12,q[1])}
  else if(c==='O')g=new THREE.OctahedronGeometry(1,0);else if(c==='I')g=new THREE.IcosahedronGeometry(1,0);else if(c==='D')g=new THREE.DodecahedronGeometry(1,0);
  else if(c==='R')g=new THREE.RingGeometry(a||.8,1,32);else if(c==='Q')g=new THREE.CircleGeometry(1,20);
  else if(c==='W'){g=new THREE.CylinderGeometry(1,1,1,3);g.translate(0,0,.5);g.scale(1/1.732,1,1/1.5)}// 지붕 삼각기둥: 용마루가 y축
  return TPR[k]=g}
 const TDK={s:.62,t:.8,w:.9};// 조명 배율(~1.7배) 보정: 빛 받는 재질은 색을 어둡게 넣어 위면이 원래 색에 가깝게
 function tmerge(L,f){let nv=0,ni=0;L.forEach(([g])=>{const c=g.attributes.position.count;nv+=c;ni+=g.index?g.index.count:c});
  const P=new Float32Array(nv*3),N=new Float32Array(nv*3),C=new Float32Array(nv*3),I=nv>65535?new Uint32Array(ni):new Uint16Array(ni),t=tv();let o=0,oi=0;
  L.forEach(([g,m,c])=>{const p=g.attributes.position,n=g.attributes.normal,cnt=p.count,r=((c>>16)&255)/255*f,gg=((c>>8)&255)/255*f,bb=(c&255)/255*f;t.n.getNormalMatrix(m);
   for(let i=0;i<cnt;i++){const j=(o+i)*3;t.v.fromBufferAttribute(p,i).applyMatrix4(m);P[j]=t.v.x;P[j+1]=t.v.y;P[j+2]=t.v.z;t.v.fromBufferAttribute(n,i).applyMatrix3(t.n).normalize();N[j]=t.v.x;N[j+1]=t.v.y;N[j+2]=t.v.z;C[j]=r;C[j+1]=gg;C[j+2]=bb}
   if(g.index){const ix=g.index.array;for(let j=0;j<ix.length;j++)I[oi++]=ix[j]+o}else for(let j=0;j<cnt;j++)I[oi++]=o+j;o+=cnt});
  const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.BufferAttribute(P,3));geo.setAttribute('normal',new THREE.BufferAttribute(N,3));geo.setAttribute('color',new THREE.BufferAttribute(C,3));geo.setIndex(new THREE.BufferAttribute(I,1));
  geo.computeBoundingSphere();geo.userData.cached=1;return geo}
 const TMAT=k=>mat('tw'+k,()=>k==='s'?std(0xffffff,{vertexColors:true,flatShading:false,roughness:.55}):k==='g'?basic(0xffffff,{vertexColors:true}):
  k==='t'?std(0xffffff,{vertexColors:true,flatShading:false,roughness:.12,transparent:true,opacity:.5,depthWrite:false}):k==='w'?std(0xffffff,{vertexColors:true,flatShading:false,transparent:true,opacity:.45,depthWrite:false}):
  basic(0xffffff,{vertexColors:true,transparent:true,opacity:k==='x'?.5:.6,depthWrite:false,blending:THREE.AdditiveBlending,side:THREE.DoubleSide}));
 const mx=(x,y,z,rx,ry,rz,sx,sy,sz)=>{const t=tv();return new THREE.Matrix4().compose(t.p.set(x,y,z),t.q.setFromEuler(t.e.set(rx||0,ry||0,rz||0)),t.s.set(sx,sy,sz))};
 function tgt(M,v){return{M,v,L:{},sp:[]}}// 메인 또는 회전 그룹: M=부모 기준 행렬, v=회전 속도
 function cx(T,M){const c={};// 부품 추가: c.s/g/t/w/a/x(모양,x,y,z,sx,sy,sz,색,rx,ry,rz)
  const add=(k,sh,x,y,z,sx,sy,sz,col,rx,ry,rz)=>{(T.L[k]||(T.L[k]=[])).push([tpr(sh),M.clone().multiply(mx(x,y,z,rx,ry,rz,sx,sy==null?sx:sy,sz==null?sx:sz)),col]);return c};
  'sgtwax'.split('').forEach(k=>c[k]=(...a)=>add(k,...a));
  c.sub=(x,y,z,rx,ry,rz,s)=>cx(T,M.clone().multiply(mx(x,y,z,rx,ry,rz,s||1,s||1,s||1)));
  c.spin=(x,y,z,v,rx,ry,rz)=>{const S2=tgt(M.clone().multiply(mx(x,y,z,rx,ry,rz,1,1,1)),v);T.sp.push(S2);return cx(S2,new THREE.Matrix4())};
  c.seg=(k,x1,y1,z1,x2,y2,z2,r,col,sh)=>{const t=tv(),d=t.d.set(x2-x1,y2-y1,z2-z1),L=d.length();t.q.setFromUnitVectors(t.z,d.normalize());
   (T.L[k]||(T.L[k]=[])).push([tpr(sh||'C'),M.clone().multiply(new THREE.Matrix4().compose(t.p.set((x1+x2)/2,(y1+y2)/2,(z1+z2)/2),t.q,t.s.set(r,r,/^[SsOID]/.test(sh||'C')?L/2:L))),col]);return c};
  return c}
 function bake(T){return{m:T.M,v:T.v,parts:Object.keys(T.L).map(k=>[tmerge(T.L[k],TDK[k]||1),k]),sp:T.sp.map(bake)}}
 function inflate(R,par,sp){R.parts.forEach(([g,k])=>{const o=new THREE.Mesh(g,TMAT(k));o.name='artT';if(k!=='s')o.renderOrder=k==='g'?0:4;par.add(o)});
  R.sp.forEach(s=>{const q=new THREE.Group();s.m.decompose(q.position,q.quaternion,q.scale);q.userData.v=s.v;par.add(q);sp.push(q);inflate(s,q,sp)})}
 // 색·공용 부품
 const GD=0xffcf3f,WD=0xb07a45,WD2=0x7a4a26,MT=0xaab3bf,DKC=0x3a3f4b,WHC=0xf3f3ee,CRM=0xfff1d0,RDC=0xe5483f,BLK=0x1c1c22,PNK=0xf9a8c8;
 const dkn=(c,f)=>{f=f==null?.7:f;return(Math.round(((c>>16)&255)*f)<<16)|(Math.round(((c>>8)&255)*f)<<8)|Math.round((c&255)*f)};
 const ltn=(c,f)=>{f=f==null?.35:f;const m=v=>Math.round(v+(255-v)*f);return(m((c>>16)&255)<<16)|(m((c>>8)&255)<<8)|m(c&255)};
 const fwd=e=>PI/2-e;// 로컬 z축을 앞(-y)에서 위로 e만큼 든 방향으로 돌리는 rx
 function base(c,lv,col,r){r=r||.41;col=col==null?0x5b6474:col;c.s('c',0,0,.045,r,r,.09,col);c.s('c',0,0,.095,r-.035,r-.035,.016,ltn(col,.22));if(lv>=4)c.s('c',0,0,.103,r-.08,r-.08,.012,0xf3d27a)}
 function eyes(c,x,y,z,r,sp,col){[-1,1].forEach(k=>{c.s('S',x+k*sp,y,z,r,r*.7,r,0xffffff);c.s('S',x+k*sp,y-r*.42,z+r*.08,r*.56,r*.4,r*.56,col||BLK);c.g('s',x+k*sp+r*.18,y-r*.75,z+r*.32,r*.2,r*.12,r*.2,0xffffff)})}
 function bird(c,x,y,z,s,col,rz){const b=c.sub(x,y,z,0,0,rz||0,s),d=dkn(col,.72);
  b.s('S',0,.05,.42,.42,.55,.4,col);b.s('S',0,-.15,.36,.3,.34,.27,0xfff3dc);b.s('S',0,-.3,.8,.34,.34,.33,col);b.s('F0',0,-.68,.77,.1,.1,.22,0xf59e0b,PI/2);
  [-1,1].forEach(k=>{b.s('s',k*.15,-.57,.9,.065,.065,.065,BLK);b.s('S',k*.38,.08,.5,.1,.34,.25,d)});b.s('B',0,.62,.58,.24,.42,.05,d,-.5);return b}
 function crown(c,x,y,z,s){c.s('C',x,y,z+.25*s,s,s,.5*s,GD);for(let i=0;i<5;i++){const a=i*PI*2/5-PI/2;c.s('F0',x+Math.cos(a)*s*.82,y+Math.sin(a)*s*.82,z+.78*s,.24*s,.24*s,.6*s,GD);c.g('s',x+Math.cos(a)*s*.82,y+Math.sin(a)*s*.82,z+1.12*s,.1*s,.1*s,.1*s,0xfff6c2)}
  c.g('S',x,y-s*.98,z+.25*s,.17*s,.1*s,.17*s,0xff3b6b)}
 function legend(c,top){const tz=top==null?1:Array.isArray(top)?top[2]:top,hz=Math.max(.42,Math.min(.75,tz*.55)),h=c.spin(0,0,hz,1.4,.22);h.g('T.06',0,0,0,.36,.36,.36,0xffd75e);for(let i=0;i<3;i++){const a=i*2.094;h.g('O',Math.cos(a)*.36,Math.sin(a)*.36,0,.04,.04,.075,0xfff6c2)}
  c.x('R.8',0,0,.07,.5,.5,1,0xffc93c);if(top!=null){const t=Array.isArray(top)?top:[0,0,top];crown(c,t[0],t[1],t[2],t[3]||.075)}}
 function fanHead(c,o){// 선풍기 머리: o={z,el,r,nb,col,bl,v,y}
  const e=o.el,h=c.sub(0,o.y||0,o.z,fwd(e)),r=o.r;h.s('S',0,0,-.1,.09,.09,.11,o.col);h.t('T.05',0,0,.03,r,r,r,0xe8f6ff);h.t('T.05',0,0,-.03,r*.9,r*.9,r*.9,0xe8f6ff);
  for(let i=0;i<4;i++)h.t('B',0,0,.035,r*1.9,.012,.012,0xe8f6ff,0,0,i*PI/4);h.s('C',0,0,.045,.05,.05,.02,o.bl||WHC);
  const s=c.spin(0,o.y||0,o.z,o.v||8,fwd(e));for(let i=0;i<o.nb;i++){const a=i*PI*2/o.nb;s.s('S',Math.cos(a)*r*.5,Math.sin(a)*r*.5,0,r*.46,r*.26,.012,o.col,0,0,a)}s.s('C',0,0,.005,.045,.045,.03,o.bl||WHC);return h}
 function puff(c,k,x,y,z,r,col){c[k]('S',x,y,z,r,r,r*.85,col);c[k]('S',x+r*.7,y+r*.1,z-r*.15,r*.7,r*.7,r*.6,col);c[k]('S',x-r*.65,y-r*.05,z-r*.2,r*.65,r*.65,r*.55,col)}
 function acornB(c,x,y,z,s){c.s('S',x,y,z,.07*s,.07*s,.085*s,0xb06a2c);c.s('H',x,y,z+.025*s,.078*s,.078*s,.06*s,0x6b4423);c.s('C',x,y,z+.09*s,.012*s,.012*s,.04*s,0x4a2f1a)}
 function squirrel(c,x,y,z,s,o){o=o||{};const q=c.sub(x,y,z,0,0,o.rz||0,s),fur=0xc9783a;
  q.s('S',0,0,.14,.13,.12,.16,fur);q.s('S',0,-.07,.13,.08,.06,.11,0xffe2bf);q.s('S',0,-.04,.33,.1,.095,.095,fur);
  [-1,1].forEach(k=>{q.s('F0',k*.06,-.02,.44,.03,.025,.07,fur);q.s('s',k*.04,-.12,.36,.018,.018,.018,BLK);q.s('S',k*(o.puff?.075:.06),-.1,.3,o.puff?.06:.03,o.puff?.05:.025,o.puff?.055:.025,o.puff?0xffc0a0:0xff9fb0)});
  q.s('s',0,-.135,.32,.014,.014,.014,0x5a2a1a);q.s('S',0,.12,.1,.08,.08,.08,0xa85e2a);q.s('S',0,.2,.22,.1,.09,.1,0xb8692e);q.s('S',0,.17,.36,.09,.085,.09,0xc9783a);q.s('S',0,.1,.42,.05,.05,.05,0xffe2bf);return q}
 function chick(c,x,y,z,s){const q=c.sub(x,y,z,0,0,0,s);q.s('S',0,0,0,.1,.1,.1,0xfde047);q.s('F0',0,-.11,0,.025,.025,.05,0xf59e0b,PI/2);[-1,1].forEach(k=>q.s('s',k*.04,-.085,.03,.012,.012,.012,BLK));return q}

 const TD={};// 디자인: TD[id](c,lv,b) → 왕관 위치(Lv.4)
 // 🪴 꿀꺽 파리지옥: 화분 + 머리 수 = 레벨(최대 3), Lv.4 왕관 쓴 큰 머리
 TD.flytrap=(c,lv)=>{base(c,lv);const G1=0x3f6212,G2=0x65a30d,RD=0xbe123c,TC=0xc2410c;
  c.s('C',0,0,.16,.24,.24,.2,TC);c.s('T.3',0,0,.26,.25,.25,.25,0xea580c);c.s('S',0,0,.25,.22,.22,.04,0x3b2a1a);
  [[.16,.1],[-.16,.08],[.02,.18]].forEach(([x,y],i)=>c.s('S',x,y,.3,.12,.05,.03,G2,0,0,i));
  const H=lv>=4?[[0,0,.95,1.25],[-.3,.08,.7,.85],[.3,.08,.7,.85]]:[[0,0,.82,1],[-.28,.06,.66,.85],[.28,.06,.66,.85]].slice(0,Math.min(3,lv));
  H.forEach(([x,y,z,k],i)=>{c.seg('s',x*.3,y*.3,.28,x,y+.06,z-.12*k,.035,G1);const h=c.sub(x,y,z,0,0,i===1?.35:i===2?-.35:0,k);
   h.s('H',0,0,0,.17,.17,.11,G2,PI);h.s('H',0,0,.005,.145,.145,.085,RD,PI);h.s('H',0,.04,.035,.17,.17,.11,G2,-.75);h.s('H',0,.035,.04,.145,.145,.085,RD,-.75);
   for(let j=-2;j<=2;j++){const a=j*.5;h.s('F0',Math.sin(a)*.15,-Math.cos(a)*.15,.01,.016,.016,.05,0xffffff);h.s('F0',Math.sin(a)*.15,-Math.cos(a)*.15+.06,.11,.016,.016,.05,0xffffff,PI-.75)}
   [-1,1].forEach(s=>{h.s('S',s*.06,.11,.17,.035,.035,.035,0xffffff);h.s('s',s*.06,.09,.18,.016,.016,.016,0x111111)})});
  return [0,.08,1.12]};// Lv.4 전설 왕관 위치
 // 🪺 월세 둥지: 둥지 + 알 3개 + '월세' 간판
 TD.wall=c=>{c.s('S',0,0,.06,.31,.31,.06,0x4a2f1a);c.s('T.42',0,0,.13,.3,.3,.26,0x8a5a2b);
  for(let i=0;i<6;i++)c.s('B',0,0,.15+(i%3)*.025,.7,.035,.03,i%2?0xb07a45:0x6e4524,0,i%2?.12:-.12,i*PI/6+.2);
  [[.08,.05],[-.08,.07],[0,-.07]].forEach(([x,y])=>c.s('S',x,y,.19,.085,.085,.11,CRM));
  c.s('C',.22,.24,.33,.022,.022,.5,WD2);const s=c.sub(.22,.22,.62,-.75);s.s('B',0,.012,0,.3,.02,.19,RDC);s.s('B',0,-.002,0,.26,.02,.15,WHC);
  s.s('B',-.03,-.016,.035,.17,.01,.028,0x2a2a2a);s.s('B',.025,-.016,-.025,.15,.01,.028,RDC);return null};
 // 🏹 알까기 새총 → 새권총 → 새개틀링건 → 알마게돈 새대포
 TD.egg=(c,lv,b)=>{const bc=b.col||0x3b82f6;base(c,lv);
  if(lv===1){c.s('C',0,0,.3,.055,.055,.42,WD);c.s('T.3',0,0,.48,.07,.07,.07,bc);[-1,1].forEach(k=>c.s('C',k*.085,0,.66,.045,.045,.34,WD,0,k*.45));
   c.seg('s',-.16,0,.81,0,.14,.8,.018,0xd94a4a);c.seg('s',.16,0,.81,0,.14,.8,.018,0xd94a4a);c.s('S',0,.16,.79,.06,.05,.07,WD2);c.s('S',0,.13,.82,.08,.08,.105,CRM);return}
  if(lv===2){c.s('C',0,0,.28,.07,.07,.38,MT);c.s('C',0,0,.48,.11,.11,.05,DKC);const g=c.sub(0,.04,.66,-.3);
   g.s('B',0,.02,0,.17,.42,.2,bc);g.s('B',0,.02,.11,.12,.38,.03,ltn(bc,.3));g.s('C',0,-.29,.03,.065,.065,.24,DKC,PI/2);g.s('T.3',0,-.41,.03,.075,.075,.075,GD,PI/2);g.s('S',0,-.43,.03,.055,.07,.055,CRM);
   g.s('B',0,.15,-.17,.13,.13,.26,0x8a5a2b,.35);g.s('T.22',0,-.02,-.13,.06,.06,.06,DKC,0,PI/2);eyes(g,0,-.12,.07,.04,.05);
   [0,1,2].forEach(i=>g.s('F0',0,.12+i*.06,.15+(i===1?.03:0),.03,.03,.1,RDC,-.3*(i-1)));return}
  if(lv===3){[0,1,2].forEach(i=>{const a=PI/2+i*2.094;c.seg('s',Math.cos(a)*.3,Math.sin(a)*.3,.1,0,0,.56,.025,MT)});c.s('B',0,0,.58,.14,.14,.1,DKC);
   const e=.4,g=c.sub(0,.02,.7,-e);g.s('C',0,.14,0,.13,.13,.3,bc,PI/2);g.s('S',0,.29,0,.1,.06,.1,dkn(bc));[-1,1].forEach(k=>g.s('C',k*.16,.25,0,.025,.025,.14,DKC,PI/2));
   g.s('B',.2,.1,-.06,.13,.2,.13,0x6b7a3a);for(let i=0;i<4;i++)g.s('S',.2,.02+i*.05,.035,.035,.03,.045,CRM);eyes(g,0,.06,.13,.04,.06);
   const s=c.spin(0,.02,.7,7,fwd(e));for(let i=0;i<6;i++){const a=i*PI/3;s.s('C',Math.cos(a)*.065,Math.sin(a)*.065,.22,.024,.024,.38,0x5b6370)}
   s.s('C',0,0,.06,.11,.11,.05,ltn(bc,.2));s.s('C',0,0,.38,.1,.1,.03,DKC);s.s('C',0,0,.22,.03,.03,.38,DKC);return}
  c.s('B',0,.12,.24,.26,.4,.14,0x6e4524);[-1,1].forEach(k=>{c.s('C',k*.2,.04,.24,.17,.17,.06,0x8a5a2b,0,PI/2);c.s('C',k*.235,.04,.24,.06,.06,.03,GD,0,PI/2);c.s('T.16',k*.2,.04,.24,.17,.17,.17,DKC,0,PI/2)});
  const e=.6,g=c.sub(0,.1,.42,fwd(e));g.s('C',0,0,.1,.15,.15,.5,0x26346a);g.s('S',0,0,-.15,.15,.15,.15,0x26346a);[-.06,.16].forEach(z=>g.s('T.2',0,0,z,.155,.155,.155,GD));
  g.s('F1.3',0,0,.38,.15,.15,.1,GD);g.s('T.25',0,0,.43,.19,.19,.19,GD);g.s('S',0,0,.48,.12,.12,.15,GD);g.g('s',.04,-.05,.55,.03,.02,.04,0xfff8d8);eyes(g,0,-.13,-.02,.045,.07);
  return [0,.2,.6]};
 // 🪶 깃털 미사일 → 간질간질 유도탄 → 깃털 다연장포 → 대륙간 간지럼탄
 const feather=(c,k,x,y,z,s,col,rx,ry,rz)=>{const f=c.sub(x,y,z,rx,ry,rz,s);f[k]('S',0,0,.5,.32,.06,.55,col);f.s('C',0,0,.4,.03,.03,1,0xffffff);return f};
 TD.air=(c,lv,b)=>{const bc=b.col||0x06b6d4;base(c,lv);
  const missile=(x,y,z,r,h,face)=>{c.s('C',x,y,z,r,r,h,WHC);c.s('F0',x,y,z+h/2+r,r,r,r*2,bc);c.s('C',x,y,z+h*.2,r*1.03,r*1.03,h*.12,bc);
   for(let i=0;i<4;i++){const a=i*PI/2+PI/4;c.s('S',x+Math.cos(a)*r*1.4,y+Math.sin(a)*r*1.4,z-h*.35,r*.9,r*.15,h*.28,bc,0,0,a)}
   if(face)eyes(c,x,y-r*.85,z+h*.05,r*.32,r*.38);};
  if(lv===1){c.s('C',0,0,.13,.3,.3,.07,DKC);[-1,1].forEach(k=>c.s('B',k*.19,.06,.45,.05,.05,.66,MT));missile(0,0,.62,.125,.66,1);feather(c,'s',0,0,1.12,.2,0xffffff,0,.3);return}
  if(lv===2){c.s('B',0,0,.14,.46,.22,.06,DKC);[-1,1].forEach(k=>{missile(k*.13,0,.6,.085,.6,1);[-.5,.5].forEach(a=>feather(c,'s',k*.13,0,.98,.16,a>0?0xcffafe:0xffffff,0,a));feather(c,'s',k*.13,.0,.22,.14,0xffffff,PI,0)});
   c.s('C',0,.14,.35,.02,.02,.5,MT);const d=c.spin(0,.14,.62,1.6);d.s('H',0,-.02,0,.1,.1,.04,0xdde3ea,-1.1);d.g('s',0,-.07,.05,.022,.022,.022,0xff4d4d);return}
  if(lv===3){c.s('C',0,0,.15,.3,.3,.1,DKC);c.s('B',0,.1,.32,.12,.12,.3,MT);const p=c.sub(0,0,.5,fwd(.9));
   p.s('B',0,0,.05,.48,.3,.4,0x2c6e7d);p.s('B',0,0,.26,.5,.32,.03,bc);for(let i=0;i<3;i++)for(let j=0;j<2;j++){const x=(i-1)*.15,y=(j-.5)*.14;p.s('C',x,y,.27,.055,.055,.03,BLK);p.s('F0',x,y,.32,.045,.045,.1,WHC);feather(p,'s',x,y,.36,.09,j?0xcffafe:0xffffff)}return}
  c.s('C',0,0,.13,.36,.36,.06,DKC);c.s('B',.28,.14,.62,.06,.06,1,0xd04a3a);[.35,.65,.95].forEach(z=>c.s('B',.2,.1,z,.18,.03,.03,0xd04a3a));
  c.s('C',0,0,.62,.13,.13,.9,WHC);[.3,.7].forEach(z=>c.s('C',0,0,z,.135,.135,.05,GD));c.s('F0',0,0,1.2,.13,.13,.24,GD);eyes(c,0,-.11,.75,.045,.05);
  for(let i=0;i<4;i++){const a=i*PI/2+PI/4;c.s('S',Math.cos(a)*.19,Math.sin(a)*.19,.3,.12,.025,.2,bc,0,0,a)}
  [-.6,0,.6].forEach(a=>feather(c,'g',0,0,1.27,.17,a?0xcffafe:0xffffff,0,a));c.a('F0',0,0,.05,.12,.12,.12,0xffb03a,PI);return null};
 // 🌰 다람쥐 대포 → 볼빵빵 곡사포 → 다람쥐 자주포 → 도토리묵 요새포
 TD.acorn=(c,lv)=>{base(c,lv,0x5f6b4e);
  if(lv===1){[-1,1].forEach(k=>{c.s('C',k*.2,0,.2,.14,.14,.05,0x7a4a26,0,PI/2);c.s('C',k*.225,0,.2,.04,.04,.03,MT,0,PI/2)});c.s('B',0,.04,.22,.3,.3,.1,WD);
   const g=c.sub(0,-.02,.3,fwd(.6));g.s('C',0,0,.14,.085,.085,.42,0x4b4f58);g.s('S',0,0,-.07,.09,.09,.09,0x4b4f58);g.s('T.3',0,0,.35,.095,.095,.095,DKC);acornB(g,0,0,.38,1);
   squirrel(c,0,.22,.27,1);acornB(c,-.27,-.2,.17,.9);return}
  if(lv===2){c.s('C',0,.0,.17,.24,.24,.1,0x6b6f78);const g=c.sub(0,-.04,.24,fwd(1.15));g.s('F1.25',0,0,.15,.13,.13,.32,0x4b4f58);g.s('T.25',0,0,.32,.165,.165,.165,DKC);acornB(g,0,0,.3,1.4);
   squirrel(c,.05,.25,.13,1.15,{puff:1,rz:.3});[[-.28,-.18],[-.3,.02],[-.2,-.3]].forEach(([x,y])=>acornB(c,x,y,.17,.95));return}
  if(lv===3){[-1,1].forEach(k=>{c.s('B',k*.19,0,.17,.11,.62,.15,0x3a3a36);for(let i=0;i<4;i++)c.s('C',k*.25,-.22+i*.145,.15,.06,.06,.03,0x777777,0,PI/2)});
   c.s('B',0,0,.27,.32,.54,.14,0x7b6a3a);c.s('C',0,.06,.4,.17,.17,.12,0x8a7840);const g=c.sub(0,-.02,.42,fwd(.3));g.s('C',0,0,.28,.05,.05,.42,0x4b4f58);g.s('C',0,0,.47,.065,.065,.06,DKC);
   squirrel(c,0,.12,.43,.85);acornB(c,.1,-.22,.36,.9);acornB(c,-.1,-.22,.36,.9);return}
  c.t('B',0,0,.27,.6,.6,.34,0xa36d36);c.s('B',0,0,.16,.56,.56,.14,0x7a4f26);for(let i=0;i<4;i++){const a=i*PI/2+PI/4;c.s('B',Math.cos(a)*.27,Math.sin(a)*.27,.48,.1,.1,.1,0x7a4f26)}
  c.s('C',0,0,.47,.2,.2,.06,GD);const g=c.sub(0,-.02,.52,fwd(.55));g.s('C',0,0,.2,.08,.08,.42,0x3d4250);g.s('T.3',0,0,.42,.09,.09,.09,GD);acornB(g,0,0,.47,1.7);
  squirrel(c,0,.16,.5,.95);return [0,.16,.93,.06]};
 // 🍤 과자 뿌리개 → 과자 분사기 → 과자 스프링클러 → 무한리필 과자탑
 const sticks=(c,x,y,z,n,s)=>{for(let i=0;i<n;i++){const a=i*2.4;c.s('B',x+Math.cos(a)*.06*s,y+Math.sin(a)*.05*s,z+(i%3)*.03*s,.035*s,.035*s,.2*s,i%2?0xf6b84a:0xe8a23a,Math.sin(a)*.5,Math.cos(a)*.5)}};
 const bag=(c,x,y,z,w,h,col)=>{c.s('B',x,y,z,w,w*.68,h,col);c.s('B',x,y,z+h*.05,w*1.02,w*.7,h*.22,0xfde047);c.s('B',x,y,z+h*.55,w*1.04,w*.3,h*.12,ltn(col,.2));c.s('B',x,y,z-h*.52,w*1.03,w*.4,h*.1,ltn(col,.2));
  c.s('C',x,y-w*.35,z+h*.05,w*.2,w*.2,.01,WHC,PI/2);c.s('F0',x,y-w*.36,z+h*.02,w*.05,w*.05,w*.08,0xf59e0b,PI/2)};
 TD.snack=(c,lv,b)=>{base(c,lv);
  if(lv===1){bag(c,0,.02,.33,.34,.42,0xe0453a);sticks(c,0,.02,.6,7,1);const r=c.spin(0,.02,.74,2.2);r.s('B',.17,0,0,.34,.04,.04,MT);r.s('H',.33,0,-.02,.05,.05,.04,MT,PI);sticks(r,.33,0,.0,3,.6);return}
  if(lv===2){bag(c,-.05,.12,.36,.34,.46,0xe0453a);sticks(c,-.05,.12,.65,6,1);c.seg('s',.12,.12,.25,.24,-.08,.42,.03,0x333333);c.s('B',.22,-.12,.42,.08,.16,.12,0x6b7280);
   c.s('C',.22,-.25,.5,.035,.035,.14,DKC,fwd(.5));c.g('S',.22,-.31,.54,.04,.04,.04,0xffd166);sticks(c,.22,-.34,.57,3,.6);return}
  if(lv===3){c.s('C',0,0,.3,.05,.05,.4,MT);bag(c,0,0,.62,.3,.32,0xe0453a);sticks(c,0,0,.8,5,.9);const r=c.spin(0,0,.52,3);
   for(let i=0;i<3;i++){const a=i*2.094;r.s('B',Math.cos(a)*.18,Math.sin(a)*.18,0,.36,.04,.04,MT,0,0,a);r.s('C',Math.cos(a)*.36,Math.sin(a)*.36,.03,.03,.03,.08,DKC);sticks(r,Math.cos(a)*.36,Math.sin(a)*.36,.05,2,.5)}return}
  bag(c,0,0,.28,.4,.34,0xe0453a);bag(c,0,0,.62,.32,.3,0xf97316);bag(c,0,0,.9,.24,.24,GD);sticks(c,0,0,1.04,5,.8);
  const r=c.spin(0,0,.5,2.6);for(let i=0;i<4;i++){const a=i*PI/2;r.s('B',Math.cos(a)*.3,Math.sin(a)*.3,0,.18,.035,.035,GD,0,0,a);sticks(r,Math.cos(a)*.4,Math.sin(a)*.4,0,2,.5)}return 1.12};
 // 🔗 참새 전봇대 → 참새 변압기 → 참새 송전탑 → 만볼트 참새철탑  (가로대 높이는 게임 전깃줄 z=1.06에 맞춤)
 TD.pylon=(c,lv)=>{base(c,lv);const za=1.06/(1+.07*(lv-1))-.02,brown=0x8f6440;
  const ins=(x,y,z)=>{c.s('F.6',x,y,z+.04,.035,.035,.08,0xe8e8e8);c.g('s',x,y,z+.09,.025,.025,.025,lv>=4?0xffe066:0x93c5fd)};
  if(lv<3){c.s('C',0,0,.55,.075,.075,1,0xbdbdb4);c.s('C',0,0,.12,.11,.11,.14,0x8b8b84);c.s('B',0,0,za,.72,.095,.095,0x6b6b66);[-.25,.25].forEach(x=>ins(x,0,za+.03));for(let i=0;i<3;i++)c.s('B',0,0,.35+i*.15,.12,.025,.025,0x777777,0,0,i%2?.4:-.4);
   bird(c,.1,0,za+.04,.27,brown);if(lv===2){c.s('C',0,-.1,.72,.085,.085,.2,0x9ca3af);c.s('C',0,-.1,.83,.09,.09,.02,0x6b7280);c.s('B',0,-.19,.72,.07,.01,.07,0xfacc15);c.s('B',.05,-.07,za-.08,.02,.06,.02,DKC);bird(c,-.14,0,za+.035,.18,0x7a5a3a,.4)}return}
  const tg=lv>=4?0xd8b25a:0xaab3bf;[[1,1],[1,-1],[-1,1],[-1,-1]].forEach(([i,j])=>c.seg('s',i*.27,j*.27,.1,i*.05,j*.05,za+.15,.022,tg));
  [[.35,.2],[.65,.13]].forEach(([z,w])=>{[-1,1].forEach(k=>{c.seg('s',-w,k*w,z,w,k*w,z,.012,tg);c.seg('s',k*w,-w,z,k*w,w,z,.012,tg)})});
  c.s('B',0,0,za,.64,.07,.06,tg);c.s('B',0,0,za-.22,.46,.06,.05,tg);[-.28,.28].forEach(x=>ins(x,0,za+.03));[-.2,.2].forEach(x=>ins(x,0,za-.19));c.s('F0',0,0,za+.18,.05,.05,.12,tg);
  bird(c,.08,0,za+.035,.2,brown);bird(c,-.15,0,za-.185,.17,0x7a5a3a,.5);
  if(lv>=4){c.g('S',0,0,za+.28,.06,.06,.06,0xfff3a0);c.a('S',0,0,za+.28,.12,.12,.12,0xffe066);return [.08,-.03,za+.24,.04]}return};
 // 📹 부엉이 CCTV → 4K 부엉이캠 → 야간투시 부엉이 → 부엉이 첩보위성
 TD.cctv=(c,lv)=>{base(c,lv);const pu=0x7c4ddb;
  const owl=(x,y,z,s,col,lens,glow,tilt)=>{const o=c.sub(x,y,z,tilt==null?-.3:tilt,0,0,s);o.s('B',0,0,0,.3,.3,.26,col);o.s('B',0,-.11,.15,.34,.2,.03,dkn(col,.75));
   [-1,1].forEach(k=>{o.s('C',k*.075,-.16,0,.07,.07,lens,BLK,PI/2);o.g('S',k*.075,-.16-lens/2,0,.052,.03,.052,glow);o.s('s',k*.075,-.18-lens/2,0,.022,.01,.022,BLK);o.s('F0',k*.11,0,.17,.04,.04,.1,col)});
   o.s('F0',0,-.17,-.06,.025,.025,.06,0xf59e0b,2.4);o.g('s',.12,-.155,.09,.018,.018,.018,0xff3030);return o};
  if(lv===1){c.s('C',0,.12,.45,.045,.045,.8,MT);c.s('B',0,.04,.86,.05,.18,.05,MT);owl(0,-.04,.92,1,pu,.04,0xffe066);return}
  if(lv===2){c.s('C',0,.14,.42,.05,.05,.75,MT);c.s('B',0,.06,.82,.06,.2,.06,MT);const o=owl(0,-.03,.92,1.2,0x6d3fd0,.1,0xfff3a0);o.s('C',.12,.06,.2,.008,.008,.18,DKC);o.g('s',.12,.06,.3,.02,.02,.02,0x7dd3fc);
   o.s('B',0,.16,0,.2,.04,.12,0x2a2a35);o.g('B',0,.185,0,.16,.01,.08,0x60a5fa);return}
  if(lv===3){c.s('C',0,0,.3,.06,.06,.42,0x4b4b5a);c.s('C',0,0,.52,.22,.22,.04,0x2a2a35);const o=owl(0,0,.68,1.1,0x3b3358,.16,0x4ade80,-.2);
   for(let i=0;i<6;i++){const a=i*PI/3;c.g('s',Math.cos(a)*.19,Math.sin(a)*.19,.54,.02,.02,.02,0xff4040)}c.t('H',0,0,.54,.24,.24,.32,0x9aa0b8);return}
  c.s('C',0,0,.4,.05,.05,.6,MT);const o=c.sub(0,0,.82,0,0,0,1);o.s('S',0,0,0,.17,.17,.17,pu);eyes(o,0,-.14,.03,.06,.065,0x3b2a1a);o.s('F0',0,-.17,-.05,.025,.025,.06,0xf59e0b,2.4);
  [-1,1].forEach(k=>{o.s('F0',k*.09,0,.17,.04,.04,.1,pu);o.s('B',k*.13,0,0,.08,.02,.02,MT);o.s('B',k*.28,0,0,.2,.14,.015,0x2a5bd7);o.s('B',k*.28,0,.005,.21,.15,.008,GD);for(let i=-1;i<=1;i++)o.s('B',k*.28+i*.065,0,.012,.006,.14,.004,0x9fbaf5)});
  o.s('H',0,.08,.15,.07,.07,.04,0xe5e7eb,-.6);o.s('C',0,.1,.21,.006,.006,.08,DKC);const r=c.spin(0,0,.82,.9,.4);r.g('T.04',0,0,0,.36,.36,.36,0xc4b5fd);r.g('s',.36,0,0,.03,.03,.03,0xffffff);return [0,0,.98,.06]};
 // 🥅 잠자리채 그물포 → 왕잠자리채 → 꽁치잡이 투망포 → 곤충채집 끝판왕
 const dfly=(c,x,y,z,s,col,k)=>{const d=c.sub(x,y,z,0,0,0,s);d[k||'s']('S',0,0,0,.025,.16,.025,col);d.s('S',0,-.17,.0,.04,.04,.035,col);[-1,1].forEach(j=>{d.s('s',j*.025,-.19,.02,.018,.018,.018,BLK);[.03,-.03].forEach(y2=>d.t('S',j*.12,y2-.06,.005,.11,.03,.005,0xe0f2fe,0,0,j*y2*3))})};
 const hoopNet=(c,x,y,z,r,rx,col)=>{const h=c.sub(x,y,z,rx);h.s('T.1',0,0,0,r,r,r,col);h.w('F0',0,0,-r*.7,r*.95,r*.95,r*1.4,0xf8fbff,PI);for(let i=0;i<3;i++)h.s('T.06',0,0,-r*(.25+i*.33),r*(.82-i*.26),r*(.82-i*.26),r*(.82-i*.26),0xe2e8f0);return h};
 TD.net=(c,lv,b)=>{const bc=b.col||0x22d3ee;base(c,lv);
  if(lv===1){c.s('C',0,0,.15,.15,.15,.12,DKC);c.seg('s',0,.13,.17,0,-.08,.78,.04,0xd9b36c);hoopNet(c,0,-.14,.92,.27,.55,bc);return}
  if(lv===2){c.s('C',0,0,.15,.13,.13,.1,DKC);[-1,1].forEach(k=>c.seg('s',k*.03,.15,.17,k*.03,-.06,.8,.025,0xd9b36c));hoopNet(c,0,-.12,.94,.26,.55,bc);dfly(c,.0,.12,.5,1,0x22c55e);return}
  if(lv===3){c.s('C',0,0,.14,.2,.2,.08,DKC);const g=c.sub(0,.05,.22,fwd(1.2));g.s('C',0,0,.15,.08,.08,.32,0x475569);g.s('T.3',0,0,.31,.09,.09,.09,bc);
   const s=c.spin(0,0,.88,1.2);s.t('H',0,0,-.05,.38,.38,.16,0xe0f7ff);for(let i=0;i<8;i++){const a=i*PI/4;s.s('s',Math.cos(a)*.38,Math.sin(a)*.38,-.05,.03,.03,.03,0x334155)}
   s.seg('s',0,0,.1,0,0,-.45,.01,0xd9b36c);[[.12,0],[-.1,.08],[0,-.14]].forEach(([x,y],i)=>s.s('S',x,y,-.02,.025,.1,.025,i%2?0xc0c8d8:0x94a3b8,0,0,i));return}
  c.s('C',0,0,.15,.2,.2,.1,DKC);[-1,1].forEach(k=>{c.seg('s',k*.05,.12,.17,k*.22,-.05,.8,.025,0xd9b36c);hoopNet(c,k*.25,-.08,.9,.19,.55,k>0?bc:0x60e0b0).s('T.1',0,0,0,.19,.19,.19,GD)});
  c.t('B',0,.18,.32,.24,.16,.2,0xd1fae5);c.s('B',0,.18,.43,.26,.18,.03,0x15803d);c.s('B',0,.18,.22,.26,.18,.03,0x15803d);dfly(c,0,.18,.32,.6,0x22c55e);dfly(c,0,-.02,1.02,1.1,GD,'g');c.s('C',0,.18,.46,.2,.2,.012,0xe8c46a);c.s('H',0,.18,.46,.1,.1,.09,0xe8c46a);c.s('C',0,.18,.48,.102,.102,.025,RDC);return null};
 // 🔥 바베큐 둥지 → 숯불구이 둥지 → 통닭 회전 둥지 → 전설의 치킨집
 const nestBBQ=(c,r,z,n)=>{c.s('T.4',0,0,z,r,r,r*.8,0x8a5a2b);c.s('S',0,0,z-.04,r*.92,r*.92,.07,0x2b2523);for(let i=0;i<n;i++){const a=i*2.4,rr2=r*.55*Math.sqrt((i+.5)/n);c.g('D',Math.cos(a)*rr2,Math.sin(a)*rr2,z+.02,.055,.055,.04,i%3?0xff6a1a:0xffb02e)}};
 const flames=(c,z,r,n,h)=>{const f=c.spin(0,0,z,2.5);for(let i=0;i<n;i++){const a=i*PI*2/n;f.g('F0',Math.cos(a)*r,Math.sin(a)*r,h/2,.05,.05,h,i%2?0xffd166:0xff7a1a)}f.g('F0',0,0,h*.6,.07,.07,h*1.2,0xffa53a);return f};
 const skewer=(c,y,z,col2)=>{c.s('C',0,y,z,.01,.01,.62,0xd9b36c,0,PI/2);[-.16,-.05,.06,.17].forEach((x,i)=>c.s('B',x,y,z,.075,.07,.07,i%2?col2:0x8b4a2b,i*.4))};
 TD.ember=(c,lv,b)=>{base(c,lv,0x4b4440);
  if(lv===1){nestBBQ(c,.3,.2,6);c.s('T.06',0,0,.3,.27,.27,.27,DKC);for(let i=-2;i<=2;i++)c.s('B',i*.1,0,.3,.018,.54-Math.abs(i)*.08,.018,DKC);flames(c,.3,.1,3,.18);skewer(c,-.06,.34,0x3fa34d);return}
  if(lv===2){nestBBQ(c,.34,.2,9);c.s('T.06',0,0,.31,.3,.3,.3,DKC);for(let i=-2;i<=2;i++)c.s('B',i*.11,0,.31,.018,.6-Math.abs(i)*.08,.018,DKC);flames(c,.31,.12,4,.22);skewer(c,-.1,.35,0x3fa34d);skewer(c,.1,.35,0xf2c14a);
   puff(c,'w',.12,.15,.7,.1,0xd8d8d8);puff(c,'w',.05,.12,.9,.08,0xe8e8e8);return}
  if(lv===3){nestBBQ(c,.3,.18,7);flames(c,.24,.1,3,.2);[-1,1].forEach(k=>{c.s('C',k*.33,0,.4,.025,.025,.56,MT);c.s('S',k*.33,0,.68,.035,.035,.035,DKC)});c.s('C',0,0,.62,.012,.012,.68,MT,0,PI/2);
   const r=c.spin(0,0,.62,2,0,PI/2);r.s('S',0,0,0,.16,.14,.2,0xc9802f);r.s('S',.05,0,.02,.1,.12,.15,0xdb9a45);[-1,1].forEach(k=>{r.s('S',.08,k*.12,-.1,.055,.055,.085,0xb86e28);r.s('C',.1,k*.15,-.19,.016,.016,.06,CRM);r.s('S',.1,k*.16,-.22,.025,.025,.02,CRM);r.s('S',-.06,k*.14,.06,.035,.05,.08,0xb86e28)});return}
  c.s('B',0,.08,.3,.56,.38,.38,0xf3e2c4);c.s('B',0,.08,.51,.62,.44,.05,RDC);for(let i=-2;i<=2;i++)c.s('B',i*.12,-.16,.46,.06,.12,.04,i%2?WHC:RDC,-.6);
  c.s('B',0,-.115,.22,.12,.01,.22,0x5a3a20);[-1,1].forEach(k=>c.g('B',k*.17,-.115,.32,.1,.01,.1,0xffd98a));nestBBQ(c,.12,.14,3);
  const r=c.spin(0,.08,.62,1.2);r.s('S',0,0,.1,.09,.09,.13,0xd08a3a);r.s('C',0,0,-.03,.025,.025,.1,CRM);[-1,1].forEach(k=>r.s('S',k*.025,0,-.09,.03,.03,.03,CRM));r.g('T.05',0,0,.1,.12,.12,.12,0xffd166);return [0,.08,.86,.06]};
 // 🌋 찜질방 분화구 → 불가마 분화구 → 황토 불가마 화산 → 용암 찜질 궁전
 const yangmeori=(c,x,y,z,s)=>{const q=c.sub(x,y,z,0,0,0,s);[-1,1].forEach(k=>{q.s('T.5',k*.09,0,0,.065,.065,.065,PNK,0,PI/2);q.s('S',k*.09,0,0,.04,.04,.04,0xffd5e3)});q.s('S',0,0,-.03,.09,.07,.04,PNK)};
 TD.lava=(c,lv)=>{base(c,lv,0x4a3f3a);const LV=0xff5a1f;
  if(lv===1){c.s('F.42',0,0,.34,.4,.4,.5,0x6b5148);c.g('C',0,0,.59,.16,.16,.02,LV);[0,2.1,4.2].forEach(a=>c.seg('g',Math.cos(a)*.17,Math.sin(a)*.17,.57,Math.cos(a)*.27,Math.sin(a)*.27,.36,.035,LV,'S'));
   yangmeori(c,0,.0,.66,1);const r=c.spin(0,0,.62,1.6);[0,2.1,4.2].forEach(a=>r.g('s',Math.cos(a)*.12,Math.sin(a)*.12,.03,.03,.03,.03,0xffb02e));return}
  if(lv===2){c.s('F.5',0,0,.18,.42,.42,.16,0x6b5148);c.s('H',0,0,.26,.32,.32,.36,0xb5653a);c.g('S',0,-.27,.32,.1,.06,.1,LV);c.s('T.2',0,-.26,.32,.12,.12,.12,0x8a4a2a,PI/2);
   c.s('C',.15,.16,.6,.055,.055,.22,0x8a4a2a);puff(c,'w',.15,.16,.8,.08,0xd0c8c0);yangmeori(c,-.05,-.02,.64,1);return}
  if(lv===3){c.s('F.36',0,0,.37,.43,.43,.56,0xc28a3e);c.g('C',0,0,.655,.15,.15,.02,LV);for(let i=0;i<4;i++){const a=i*PI/2+.4;c.seg('g',Math.cos(a)*.16,Math.sin(a)*.16,.64,Math.cos(a)*.37,Math.sin(a)*.37,.16,.03,LV,'S')}
   c.s('H',0,-.3,.1,.1,.06,.14,0x8a4a2a);c.g('H',0,-.33,.1,.07,.03,.1,LV);yangmeori(c,0,0,.72,1.1);const r=c.spin(0,0,.68,2);for(let i=0;i<4;i++){const a=i*PI/2;r.g('s',Math.cos(a)*.14,Math.sin(a)*.14,.08+i*.03,.025,.025,.025,0xffd166)}return}
  c.s('F.65',0,0,.2,.43,.43,.22,0x5a4038);c.g('T.12',0,0,.12,.38,.38,.3,LV);c.s('B',0,0,.4,.36,.28,.18,0xc2412d);for(let i=0;i<4;i++)c.s('C',-.15+i*.1,-.15,.4,.02,.02,.18,0x8b1d1d);
  [0,PI].forEach(a=>c.seg('g',Math.cos(a)*.2,.0,.32,Math.cos(a)*.4,0,.1,.04,LV,'S'));c.seg('g',0,.17,.32,0,.38,.1,.04,LV,'S');c.s('W',0,0,.49,.5,.36,.12,0x1f5f5b,0,0,PI/2);c.s('B',0,0,.62,.24,.18,.12,0xc2412d);c.s('W',0,0,.68,.34,.26,.12,0x1f5f5b,0,0,PI/2);c.s('B',0,0,.8,.04,.28,.02,GD);c.s('B',0,0,.6,.52,.04,.02,GD);
  yangmeori(c,0,.0,.86,.9);return [0,0,.9,.06]};
 // ☀️ 자외선 등대 → 땡볕 등대 → 돋보기 등대 → 폭염 태양신전
 const lighthouse=(c,h,r)=>{c.s('F.62',0,0,.1+h/2,r,r,h,WHC);[.3,.62].forEach(f=>{const z=.1+h*f,rr2=r*(1-.38*f)+.005;c.s('F.95',0,0,z,rr2,rr2,h*.12,RDC)});const t=.1+h;c.s('C',0,0,t+.02,r*.85,r*.85,.04,DKC);return t};
 TD.sun=(c,lv,b)=>{base(c,lv);const SY=0xffe066;
  if(lv===1){const t=lighthouse(c,.8,.2);c.g('C',0,0,t+.1,.1,.1,.14,SY);c.s('F0',0,0,t+.24,.13,.13,.14,RDC);c.s('B',0,-.1,t+.11,.2,.02,.05,BLK);const r=c.spin(0,0,t+.1,1.2);[-1,1].forEach(k=>r.a('F2.5',k*.23,0,0,.045,.045,.3,0xffd84a,0,k*PI/2));return}
  if(lv===2){const t=lighthouse(c,.78,.21);c.s('C',0,0,t+.1,.02,.02,.2,DKC);c.g('S',0,0,t+.22,.14,.14,.14,0xffc93c);c.s('B',0,-.13,t+.25,.22,.03,.06,BLK);[-1,1].forEach(k=>c.s('C',k*.055,-.145,t+.25,.045,.045,.01,0x222244,PI/2));
   const r=c.spin(0,0,t+.22,1.5);for(let i=0;i<8;i++){const a=i*PI/4;r.seg('g',Math.cos(a)*.15,Math.sin(a)*.15,0,Math.cos(a)*.27,Math.sin(a)*.27,0,.04,0xffb020,'F0')}return}
  if(lv===3){const t=lighthouse(c,.62,.2);c.g('C',0,0,t+.08,.09,.09,.12,SY);c.s('F0',0,0,t+.18,.11,.11,.1,RDC);const m=c.sub(0,-.05,t+.36,.7);m.s('T.12',0,0,0,.2,.2,.2,0xb07a2a);m.g('S',0,0,0,.185,.185,.025,0xbfefff);m.g('S',.06,.06,.02,.04,.04,.01,0xffffff);m.s('C',0,.0,-.32,.03,.03,.24,0x8a5a2b,0,0,0);
   c.a('F0',0,-.24,.32,.06,.06,.5,0xfff2a0,-.6);c.g('Q',0,-.33,.11,.08,.08,1,0xffffff);return}
  [[.6,.1],[.46,.2],[.32,.3]].forEach(([w,z])=>c.s('B',0,0,z,w,w,.1,0xe0c48a));for(let i=0;i<4;i++){const a=i*PI/2+PI/4;c.s('C',Math.cos(a)*.15,Math.sin(a)*.15,.5,.03,.03,.3,WHC)}c.s('B',0,0,.67,.34,.34,.04,0xf0e0b0);
  c.g('S',0,0,.85,.14,.14,.14,0xffc93c);c.s('T.15',0,0,.85,.16,.16,.16,GD,fwd(.8));const r=c.spin(0,0,.85,1.2,fwd(.8));for(let i=0;i<8;i++){const a=i*PI/4;r.seg('g',Math.cos(a)*.17,Math.sin(a)*.17,0,Math.cos(a)*.31,Math.sin(a)*.31,0,.045,0xffb020,'F0')}return [0,0,1.02,.06]};
 // ❄️ 냉동 달걀 → 꽁꽁 언 달걀 → 냉동실 계란판 → 만년설 황금알
 const egg=(c,x,y,z,s,col,face)=>{c.s('S',x,y,z,.1*s,.1*s,.13*s,col||CRM);if(face){[-1,1].forEach(k=>c.s('s',x+k*.035*s,y-.09*s,z+.03*s,.014*s,.01*s,.02*s,BLK));c.s('S',x,y-.095*s,z-.015*s,.02*s,.01*s,.008*s,0xf87171)}};
 TD.ice=(c,lv)=>{base(c,lv,0x5d7690);const IC=0xbfe9ff;
  if(lv===1){egg(c,0,0,.32,1.15,0xeaf6ff,1);c.t('B',0,0,.33,.38,.38,.42,IC);c.s('S',0,0,.55,.2,.2,.04,WHC);[[-.17,-.17],[.17,-.17],[0,-.19]].forEach(([x,y])=>c.t('F0',x,y,.07,.03,.03,.1,IC,PI));return}
  if(lv===2){egg(c,0,0,.4,1.6,0xe0f2ff,1);c.s('T.35',0,0,.32,.15,.15,.15,0xef4444);c.s('B',.1,-.1,.28,.05,.02,.14,0xef4444,.2);c.s('S',0,0,.6,.1,.1,.03,WHC);
   for(let i=0;i<6;i++){const a=i*PI/3+.3;c.t('O',Math.cos(a)*.27,Math.sin(a)*.27,.25+(i%2)*.06,.06,.06,.16+(i%2)*.06,IC,Math.sin(a)*.4,-Math.cos(a)*.4)}return}
  if(lv===3){c.s('B',0,0,.17,.56,.38,.08,0xc8d6e0);for(let i=0;i<3;i++)for(let j=0;j<2;j++){const x=(i-1)*.18,y=(j-.5)*.18;c.s('F.7',x,y,.2,.07,.07,.05,0xb0c4d0,PI);egg(c,x,y,.29,.8,(i+j)%2?0xeaf6ff:CRM,i===1&&j===0)}
   c.t('B',0,.25,.42,.58,.04,.56,IC);c.t('B',0,.04,.71,.58,.46,.04,IC);c.s('S',.15,.05,.74,.12,.1,.03,WHC);c.s('S',-.18,.0,.74,.09,.08,.025,WHC);return}
  c.s('F0',0,.04,.4,.4,.38,.62,0xdbeafe);c.s('F0',0,.04,.6,.17,.16,.24,WHC);c.s('F0',.24,-.12,.24,.17,.17,.28,0xe0ecfb);c.s('F0',-.25,-.1,.22,.15,.15,.24,0xe0ecfb);
  c.s('S',0,-.02,.82,.13,.13,.165,GD);c.g('s',-.04,-.11,.88,.03,.02,.04,0xfff8d8);[-1,1].forEach(k=>c.s('s',k*.045,-.125,.84,.016,.01,.022,BLK));return [0,-.02,.96,.055]};
 // 💎 얼음땡 결정 → 얼음땡 고드름 → 얼음땡 술래탑 → 땡 없는 빙하
 TD.frost=(c,lv,b)=>{base(c,lv,0x4f6f8a);const IC=0x8be9fd;
  const cluster=(s)=>{c.t('O',0,0,.55*s,.14*s,.14*s,.45*s,IC);c.g('O',0,0,.55*s,.05*s,.05*s,.2*s,0xe0fbff);[[.17,0,.3,.5],[-.12,.13,.27,-.5],[-.06,-.17,.25,.4]].forEach(([x,y,h,t])=>c.t('O',x,y,.1+h*s*.7,.07*s,.07*s,h*s,0xa5f3fc,y*2,-x*2))};
  if(lv===1){cluster(1);return}
  if(lv===2){cluster(1.05);c.t('T.12',0,0,.92,.3,.3,.3,0xcffafe);for(let i=0;i<8;i++){const a=i*PI/4;c.t('F0',Math.cos(a)*.3,Math.sin(a)*.3,.8,.035,.035,.2+(i%2)*.08,IC,PI)}[0,PI].forEach(a=>c.s('C',Math.cos(a)*.3,0,.5,.02,.02,.8,0xcbd5e1));return}
  if(lv===3){c.t('c',0,0,.42,.15,.15,.66,IC);c.g('c',0,0,.42,.06,.06,.6,0xe0fbff);c.s('S',0,0,.86,.15,.15,.15,0xe0f7ff);c.s('T.25',0,0,.88,.15,.15,.12,0xef4444);c.s('B',0,.15,.88,.04,.06,.03,0xef4444);
   [-1,1].forEach(k=>{c.s('S',k*.1,-.12,.88,.045,.045,.045,0xe0f7ff);c.s('C',k*.13,-.06,.74,.025,.025,.2,0xe0f7ff,.5)});c.s('A.15,3.14',0,-.135,.8,.03,.03,.03,0x334155,PI/2,0,PI);
   [[.22,.05],[-.2,.1],[.05,-.22]].forEach(([x,y])=>c.t('O',x,y,.2,.06,.06,.16,0xa5f3fc));return}
  [[0,.05,.25,.34,.3],[.18,-.12,.2,.2,.18],[-.2,-.1,.2,.22,.2],[0,.0,.55,.25,.25]].forEach(([x,y,z,r,h])=>c.t('D',x,y,z,r,r,h,0x9feaf9));c.s('S',0,.02,.76,.2,.2,.05,WHC);
  c.g('O',0,0,.62,.1,.1,.22,0xe0fbff);c.t('O',.22,.12,.5,.06,.06,.18,IC);return [0,.02,.8,.065]};
 // 🌨️ 에어컨 18도 탑 → 16도 탑 → 냉장고 4도 탑 → 남극 영하40도 탑
 const acUnit=(c,x,y,z,w,h,dig,lvv)=>{c.s('B',x,y,z,w,w*.6,h,0xe8edf2);for(let i=0;i<3;i++)c.s('B',x-w*.12,y-w*.3,z-h*.25+i*h*.22,w*.6,.01,.012,0x9aa5b1);
  c.s('B',x+w*.33,y-w*.3,z+h*.1,w*.22,.01,h*.3,0x1f2937);c.g('B',x+w*.33,y-w*.31,z+h*.1,w*.16,.01,h*.18,dig);
  const fx2=x-w*.1,fz=z+h/2;c.s('C',fx2,y,fz+.005,w*.26,w*.26,.012,0x2b3440);c.s('T.08',fx2,y,fz+.012,w*.26,w*.26,w*.26,0xb8c2cc);c.s('T.1',fx2,y,fz+.012,w*.13,w*.13,w*.13,0xb8c2cc);
  const s=c.spin(fx2,y,fz+.02,lvv||6);for(let i=0;i<4;i++){const a=i*PI/2;s.s('S',Math.cos(a)*w*.12,Math.sin(a)*w*.12,0,w*.11,w*.05,.006,0x7dd3fc,0,0,a)}
  c.s('C',x+w*.35,y+w*.05,fz+.01,.012,.012,.01,0xcd7f32)};
 TD.bliz=(c,lv)=>{base(c,lv);const CY2=0x67e8f9;
  if(lv===1){[-1,1].forEach(k=>c.s('B',k*.18,0,.14,.05,.28,.08,MT));acUnit(c,0,0,.38,.6,.42,CY2);puff(c,'w',.2,-.05,.7,.07,0xffffff);return}
  if(lv===2){acUnit(c,0,0,.3,.6,.38,0x38bdf8);acUnit(c,0,.02,.7,.48,.32,0x38bdf8,8);for(let i=0;i<5;i++)c.t('F0',-.24+i*.12,-.19,.47,.02,.02,.08,0xcffafe,PI);puff(c,'w',-.2,0,1,.08,0xffffff);puff(c,'w',.22,-.02,.95,.06,0xffffff);return}
  if(lv===3){c.s('B',0,0,.56,.44,.36,.9,0xeaf2f7);c.s('B',0,-.183,.7,.42,.01,.012,0x9aa5b1);[[.66,.82],[.25,.48]].forEach(([z0])=>c.s('B',-.15,-.19,z0+.04,.025,.03,.16,MT));
   [[.1,.4,0xf87171],[.14,.3,0x60a5fa],[.06,.25,0xfacc15]].forEach(([x,z,col])=>c.s('S',x,-.19,z,.025,.012,.025,col));c.g('B',.13,-.19,.85,.08,.01,.06,CY2);
   const f=c.sub(0,0,1.02);for(let i=0;i<3;i++)f.g('B',0,0,0,.3,.03,.02,0xe0fbff,0,0,i*PI/3);c.s('S',0,0,1.01,.2,.16,.03,WHC);return}
  c.s('C',0,0,.42,.22,.22,.64,0xe0f2fe);for(let i=0;i<4;i++)c.s('T.08',0,0,.18+i*.15,.222,.222,.222,0xbcd8ee);c.s('S',0,0,.75,.24,.24,.06,WHC);
  c.s('B',0,-.2,.5,.2,.04,.1,0x1f2937);c.g('B',0,-.222,.5,.16,.01,.06,0x38bdf8);
  const p=c.sub(0,0,.88);p.s('S',0,0,0,.1,.09,.13,0x1f2937);p.s('S',0,-.04,-.01,.07,.06,.1,WHC);p.s('F0',0,-.11,.05,.02,.02,.05,0xf59e0b,PI/2);[-1,1].forEach(k=>{p.s('s',k*.035,-.085,.07,.012,.01,.012,0xffffff);p.s('S',k*.04,-.05,-.13,.035,.04,.012,0xf59e0b);p.s('S',k*.1,0,0,.025,.06,.08,0x1f2937)});
  return [0,0,1.01,.05]};
 // ✨ 겨울 니트 깃털 → 털스웨터 깃털 → 수면바지 깃털 → 문고리 대마왕
 const knit=(c,z0,n,r,cA,cB)=>{for(let i=0;i<n;i++)c.s('T.45',0,0,z0+i*r*.75,r,r,r,i%2?cA:cB)};
 const sparks=(c,z,r,n,v)=>{const s=c.spin(0,0,z,v||3.5);for(let i=0;i<n;i++){const a=i*PI*2/n;s.g('O',Math.cos(a)*r,Math.sin(a)*r,(i%2)*.06,.025,.025,.06,i%2?0xffffff:0xfde047)}return s};
 TD.static=(c,lv,b)=>{base(c,lv);const FY=0xfde047;
  if(lv===1){c.s('C',0,0,.28,.035,.035,.36,MT);const f=c.sub(0,0,.48,-.35);feather(f,'s',0,0,0,.72,FY);knit(f,.0,3,.065,0xd94a4a,WHC);sparks(c,.75,.3,4);return}
  if(lv===2){c.s('C',0,0,.34,.22,.22,.44,0xd94a4a);[.22,.4].forEach(z=>c.s('C',0,0,z,.225,.225,.04,WHC));for(let i=0;i<6;i++){const a=i*PI/3;c.s('O',Math.cos(a)*.22,Math.sin(a)*.22,.31,.025,.025,.04,WHC)}c.s('T.45',0,0,.58,.17,.17,.17,0xb83a3a);
   [-.5,0,.5].forEach(a=>feather(c,'s',0,0,.6,.75,FY,0,a));sparks(c,.7,.33,5);return}
  if(lv===3){[-1,1].forEach(k=>{c.s('C',k*.1,0,.27,.1,.1,.34,PNK);c.s('C',k*.1,0,.11,.105,.105,.04,0xf472b6)});c.s('B',0,0,.48,.42,.24,.14,PNK);c.s('B',0,0,.56,.43,.25,.04,0xf472b6);
   for(let i=0;i<10;i++){const a=i*1.7;c.s('s',Math.cos(a)*.15*(i%2?1:.6),-.12,.2+(i%5)*.08,.022,.01,.022,WHC)}[-.45,0,.45].forEach(a=>feather(c,'s',0,0,.58,.8,FY,0,a));sparks(c,.6,.36,6,4.5);return}
  const d=c.sub(0,.06,.08,-.4);d.s('B',0,.06,.42,.5,.07,.84,0x8a5a2b);d.s('B',0,.02,.42,.4,.02,.7,0x9e6a36);d.s('C',0,-.0,.45,.11,.11,.03,GD,PI/2);d.s('C',0,-.06,.45,.035,.035,.1,GD,PI/2);
  d.s('S',0,-.15,.45,.13,.12,.13,GD);d.g('s',-.04,-.24,.5,.03,.015,.03,0xfff8d8);[-1,1].forEach(k=>{d.s('s',k*.045,-.25,.47,.018,.01,.024,BLK);d.s('B',k*.045,-.25,.51,.05,.01,.012,BLK,0,k*.4)});
  sparks(c,.55,.38,8,5);return [0,.0,.94,.06]};
 // ⚡ 찌릿찌릿 피뢰침 → 뽀글뽀글 피뢰침 → 번개 파마 탑 → 전설의 벼락파마
 const perm=(c,x,y,z,r,n,col,curl)=>{for(let i=0;i<n;i++){const t=i/n,ph=Math.acos(1-1.4*t),th=i*2.4;c.s('S',x+Math.sin(ph)*Math.cos(th)*r,y+Math.sin(ph)*Math.sin(th)*r,z+Math.cos(ph)*r*.9,r*.42,r*.42,r*.42,col)}c.s('S',x,y,z,r*.8,r*.8,r*.72,col);
  if(curl)for(let i=0;i<4;i++){const a=i*PI/2+.4;c.sub(x+Math.cos(a)*r*.92,y+Math.sin(a)*r*.92,z+r*.2,0,0,a+PI/2).s('C',0,0,0,r*.16,r*.16,r*.4,0xf472b6,0,PI/2)}};
 const bolts=(c,z,r,v,col)=>{const s=c.spin(0,0,z,v);[0,PI].forEach(a=>{const q=s.sub(Math.cos(a)*r,Math.sin(a)*r,0,0,0,a);q.g('B',0,0,.07,.025,.06,.12,col,0,.6).g('B',0,0,-.03,.025,.06,.1,col,0,-.6).g('B',0,0,-.12,.025,.05,.1,col,0,.6)});return s};
 TD.thunder=(c,lv,b)=>{base(c,lv,0x6b5a3a);const cu=0xd9873a;c.s('C',0,0,.2,.2,.24,.2,0x854d0e);
  if(lv===1){c.s('C',0,0,.62,.04,.04,.9,0x9a6a3a);for(let i=0;i<5;i++)c.s('T.3',0,0,.36+i*.08,.13-i*.012,.13-i*.012,.13-i*.012,cu);c.s('F0',0,0,1.1,.04,.04,.12,MT);c.g('S',0,0,1.0,.07,.07,.07,0xfde047);bolts(c,.85,.28,2.6,0xfde047);return}
  if(lv===2){c.s('C',0,0,.56,.045,.045,.76,0x9a6a3a);for(let i=0;i<5;i++)c.s('T.3',0,0,.34+i*.08,.14-i*.012,.14-i*.012,.14-i*.012,cu);perm(c,0,0,1.02,.13,9,0x5a3a22);c.g('s',0,-.1,1.02,.03,.03,.03,0xfde047);
   c.s('F0',0,0,1.2,.03,.03,.1,MT);bolts(c,.8,.3,3,0xfde047);return}
  if(lv===3){c.s('F.7',0,0,.47,.13,.13,.5,0x9a6a3a);for(let i=0;i<4;i++)c.s('T.3',0,0,.32+i*.1,.14-i*.01,.14-i*.01,.14-i*.01,cu);c.s('S',0,0,.82,.13,.13,.13,0xf6c7a0);eyes(c,0,-.11,.83,.035,.045);
   perm(c,0,.02,.98,.2,14,0x3b2416,1);bolts(c,.8,.36,3.4,0xfde047);return}
  c.s('F.7',0,0,.47,.14,.14,.5,GD);c.s('S',0,0,.82,.13,.13,.13,0xf6c7a0);eyes(c,0,-.11,.83,.035,.045);perm(c,0,.02,.98,.21,14,0xf2b52a,1);c.g('S',0,.02,.99,.2,.2,.18,0xffe08a);
  bolts(c,.8,.38,3.8,0xfff3a0);bolts(c,.55,.36,-2.6,0xfde047);return [0,.02,1.17,.06]};
 // 🌩️ 월요병 먹구름 → 출근길 먹구름 → 야근 먹구름 → 월요일 무한반복
 const cloud=(c,z,s,col)=>{[[0,0,0,.22],[.18,0,-.04,.16],[-.18,.02,-.04,.16],[.04,.1,.1,.17],[.1,-.06,.1,.13],[-.11,.06,.08,.14]].forEach(([x,y,dz,r])=>c.s('S',x*s,y*s,z+dz*s,r*s,r*s,r*s*.9,col));
  const f=c.sub(0,-.2*s,z+.0,-.35,0,0,s);[-1,1].forEach(k=>{f.s('S',k*.07,0,.01,.035,.02,.025,0xffffff);f.s('s',k*.07,-.012,.0,.018,.012,.018,BLK);f.s('B',k*.07,-.01,.05,.06,.01,.012,BLK,0,k*-.4)});f.s('A.12,3.14',0,-.01,-.07,.04,.04,.04,BLK,PI/2);return f};
 const zig=(c,x,y,z,s)=>{c.g('B',x,y,z,.03*s,.03*s,.14*s,0xfde047,0,.5).g('B',x+.03*s,y,z-.11*s,.03*s,.03*s,.13*s,0xfde047,0,-.6).g('F0',x+.0,y,z-.21*s,.03*s,.03*s,.1*s,0xfde047,PI,-.5)};
 TD.storm=(c,lv,b)=>{base(c,lv);const CL=0x5b5675;
  if(lv===1){c.s('C',0,0,.35,.035,.035,.5,MT);cloud(c,.82,1,CL);zig(c,.04,-.02,.6,1);[[.14,.08],[-.12,-.02]].forEach(([x,y])=>c.t('S',x,y,.55,.02,.02,.05,0x60a5fa));return}
  if(lv===2){c.s('C',0,0,.35,.035,.035,.5,MT);const f=cloud(c,.84,1.1,0x4c4766);c.s('B',0,-.235,.68,.05,.015,.05,0xdc2626);c.s('F0',0,-.235,.58,.04,.012,.14,0xdc2626,PI);
   c.s('B',.24,-.05,.42,.14,.06,.11,0x7a4a26);c.s('A.15,3.14',.24,-.05,.48,.04,.04,.04,DKC,PI/2);zig(c,-.12,0,.6,1);return}
  if(lv===3){c.s('C',0,0,.3,.035,.035,.4,MT);const f=cloud(c,.86,1.25,0x3b3655);[-1,1].forEach(k=>f.s('S',k*.07,-.006,-.025,.035,.01,.012,0x7e22ce));
   c.s('B',0,-.08,.46,.24,.03,.16,0x1f2937);c.g('B',0,-.097,.46,.2,.01,.12,0x60a5fa);c.s('B',0,-.05,.37,.04,.04,.06,DKC);c.s('C',.22,-.12,.47,.04,.04,.07,WHC);c.s('T.2',.26,-.12,.47,.025,.025,.025,WHC,0,PI/2);zig(c,-.2,0,.66,1.1);return}
  c.s('C',0,0,.3,.035,.035,.4,MT);cloud(c,.82,1.2,0x433b62);zig(c,.0,-.02,.55,1);const r=c.spin(0,0,.82,1.1);for(let i=0;i<6;i++){const a=i*PI/3;const q=r.sub(Math.cos(a)*.38,Math.sin(a)*.38,0,0,0,a+PI/2);q.s('B',0,0,0,.1,.01,.12,WHC,-.3);q.s('B',0,.0,.05,.1,.012,.03,0xdc2626,-.3)}
  r.g('T.05',0,0,0,.38,.38,.38,0xffd75e);return [0,.0,1.06,.06]};
 // 🎐 미풍 선풍기 → 미풍 회전 선풍기 → 미풍이라던 선풍기 → 미풍 탈 쓴 태풍
 const fanBase=(c,col,r)=>{c.s('C',0,0,.12,r,r,.05,WHC);[[-.08,0x5eead4],[0,WHC],[.08,0xf87171]].forEach(([x,cc])=>c.s('B',x,-r*.75,.15,.05,.04,.03,cc,.3))};
 TD.breeze=(c,lv,b)=>{const bc=b.col||0x5eead4;base(c,lv);
  if(lv===1){fanBase(c,bc,.27);c.s('C',0,0,.45,.035,.035,.62,WHC);fanHead(c,{z:.8,el:.85,r:.25,nb:3,col:bc,v:5});return}
  if(lv===2){fanBase(c,bc,.28);c.s('C',0,0,.45,.035,.035,.62,WHC);const o=c.spin(0,0,0,.7);fanHead(o,{z:.82,el:.8,r:.27,nb:4,col:bc,v:7});o.s('B',0,.1,.82,.04,.12,.04,WHC);return}
  if(lv===3){fanBase(c,bc,.3);c.s('C',0,0,.45,.045,.045,.62,WHC);fanHead(c,{z:.84,el:.75,r:.32,nb:5,col:0x2dd4bf,v:12});const w=c.spin(0,-.1,.95,4,fwd(.75));[.38,.44].forEach((r,i)=>w.a('A.03,2',0,0,.08+i*.06,r,r,r,0xb8fff0,0,0,i*2));return}
  const t=c.spin(0,0,.1,3.5);[[.08,.05],[.13,.18],[.18,.33],[.24,.5],[.3,.68]].forEach(([r,z],i)=>t.t('T.3',0,0,z,r,r,r*.8,i%2?0x99f6e4:0x5eead4));t.a('A.06,4',0,0,.85,.35,.35,.35,0xb8fff0);
  fanHead(c,{z:.62,el:.7,r:.22,nb:3,col:GD,v:9,y:-.12,bl:GD});const m=c.sub(0,-.2,.73,fwd(.7));eyes(m,0,0,.08,.04,.07);return [0,-.05,.95,.06]};
 // 🧼 비눗방울 막대 → 비눗방울 기계 → 비눗방울 대포 → 거품 목욕탕 대왕
 const BU=0xbfe9ff,BU2=0xf5c6ff;
 const bub=(c,x,y,z,r,col)=>{c.t('S',x,y,z,r,r,r,col||BU);c.g('s',x-r*.38,y-r*.38,z+r*.42,r*.18,r*.18,r*.18,0xffffff)};
 const wand=(c,x,y,z,s,col)=>{const q=c.sub(x,y,z,0,0,0,s);q.s('C',0,0,-.25,.022,.022,.5,col);q.s('T.16',0,0,.12,.13,.13,.13,col,PI/2);q.t('Q',0,.005,.12,.12,.12,.12,BU,PI/2);return q};
 const sbottle=(c,x,y,z,s,col)=>{const q=c.sub(x,y,z,0,0,0,s);q.t('C',0,0,.14,.11,.11,.28,col||0x7dd3fc);q.s('C',0,0,.08,.105,.105,.12,0x38bdf8);q.s('C',0,0,.31,.06,.06,.06,0xf472b6);return q};
 const orbit=(c,z,R,n,v,r)=>{const o=c.spin(0,0,z,v);for(let i=0;i<n;i++){const a=i*PI*2/n;bub(o,Math.cos(a)*R,Math.sin(a)*R,(i%2)*.12,r*(i%2?.8:1),i%3===2?BU2:BU)}return o};
 TD.wind=(c,lv,b)=>{base(c,lv);
  if(lv===1){sbottle(c,.15,.1,.1,1);wand(c,-.06,-.04,.55,1,0xf472b6);bub(c,-.12,-.18,.95,.12);bub(c,.08,-.3,1.12,.08,BU2);bub(c,-.25,-.05,1.2,.06);return}
  if(lv===2){c.s('B',0,.03,.3,.46,.36,.38,0xfda4af);c.s('B',0,.03,.5,.48,.38,.04,0xf472b6);c.s('C',0,-.16,.3,.12,.12,.04,0xfff1f2,PI/2);c.s('T.2',0,-.17,.3,.12,.12,.12,0xf472b6,PI/2);
   const s=c.spin(0,-.19,.3,10,PI/2);for(let i=0;i<4;i++){const a=i*PI/2;s.s('B',Math.cos(a)*.05,Math.sin(a)*.05,0,.08,.03,.01,0xffffff,0,0,a)}
   sbottle(c,.16,.12,.52,.7);eyes(c,0,-.15,.42,.035,.1);orbit(c,.85,.34,4,1.2,.11);bub(c,0,-.45,.55,.14);return}
  if(lv===3){c.s('B',0,.05,.22,.42,.42,.18,0x64748b);[-1,1].forEach(k=>c.s('C',k*.25,.05,.2,.11,.11,.06,0x334155,0,PI/2));
   const h=c.sub(0,0,.48,fwd(.45));h.s('C',0,0,0,.17,.17,.5,0x7dd3fc);h.s('T.25',0,0,.25,.17,.17,.17,0xf472b6);h.s('C',0,0,-.2,.2,.2,.1,0x38bdf8);h.t('Q',0,0,.26,.15,.15,.15,BU);
   sbottle(c,-.2,.2,.32,.8,0xf9a8d4);bub(c,0,-.5,.85,.17);bub(c,.2,-.35,1.05,.1,BU2);orbit(c,1,.4,5,1.5,.1);return}
  c.s('C',0,0,.28,.38,.38,.3,0xf8fafc);c.s('T.18',0,0,.43,.38,.38,.38,0xe2e8f0);c.t('C',0,0,.42,.33,.33,.03,0x7dd3fc);
  [[0,0,.48,.16],[-.18,.1,.5,.13],[.17,.12,.49,.12],[-.1,-.18,.47,.11],[.16,-.15,.47,.1]].forEach(([x,y,z,r])=>c.s('S',x,y,z,r,r,r*.7,0xffffff));
  const d=c.sub(.05,-.02,.62,0,0,0,1);d.s('S',0,0,0,.12,.14,.1,0xfde047);d.s('S',0,-.1,.1,.08,.08,.08,0xfde047);d.s('F0',0,-.19,.09,.03,.025,.06,0xf97316,PI/2);eyes(d,0,-.16,.13,.02,.035);
  [-1,1].forEach(k=>c.s('C',k*.3,.25,.62,.02,.02,.3,0xcbd5e1));c.s('B',0,.25,.77,.62,.025,.025,0xcbd5e1);
  orbit(c,1.05,.45,6,1,.12);bub(c,0,0,1.25,.2,BU2);return [0,.05,.75,.06]};
 // 🌀 회오리 감자 → 치즈 회오리 감자 → 왕꼬치 회오리 → 휴게소의 전설
 const spiral=(c,x,y,z0,z1,r,n,col,v,cheese)=>{const s=c.spin(x,y,0,v);n=Math.round(n*1.9);for(let i=0;i<n;i++){const t=i/(n-1),a=i*.5,z=z0+(z1-z0)*t,rr2=r*(1-.3*Math.abs(t-.5)*2);s.sub(0,0,z,0,0,a).s('B',rr2*.55,0,0,rr2,r*.55,.03,i%2?col:dkn(col,.88),.3);
   if(cheese&&i%4===1)s.s('S',Math.cos(a)*rr2*.9,Math.sin(a)*rr2*.9,z-.02,.03,.03,.045,0xffe066)}return s};
 TD.twister=(c,lv,b)=>{base(c,lv);const PO=0xf2c04a;
  if(lv===1){c.s('C',0,0,.62,.016,.016,1.06,0xd9b36c);spiral(c,0,0,.25,.95,.17,16,PO,1.6);return}
  if(lv===2){c.s('C',0,0,.62,.018,.018,1.06,0xd9b36c);spiral(c,0,0,.24,.96,.19,17,0xf5c95a,1.8,1);c.s('S',0,0,1.0,.06,.06,.05,0xffe066);return}
  if(lv===3){c.s('C',0,0,.66,.022,.022,1.14,0xd9b36c);spiral(c,0,0,.28,1.05,.24,18,PO,2);[[-1,.6],[1,-.6]].forEach(([k,v])=>{c.s('C',k*.3,.08,.42,.012,.012,.62,0xd9b36c);spiral(c,k*.3,.08,.2,.66,.1,9,0xe8b440,v*3)});return}
  c.s('F1.25',0,0,.2,.16,.16,.2,WHC);for(let i=0;i<6;i++){const a=i*PI/3;c.s('B',Math.cos(a)*.17,Math.sin(a)*.17,.2,.04,.012,.2,RDC,0,0,a+PI/2)}c.s('C',0,0,.68,.024,.024,1,GD);
  spiral(c,0,0,.36,1.08,.24,17,0xf7c948,2.2,1);c.s('C',.28,.08,.22,.05,.05,.2,0xdc2626);c.s('F0',.28,.08,.36,.03,.03,.07,0xdc2626);return [0,0,1.14,.055]};
 // 🦇 박쥐 고시원 → 박쥐 원룸 → 박쥐 오피스텔 → 박쥐 펜트하우스
 const batF=(c,x,y,z,s,col,k)=>{const q=c.sub(x,y,z,0,0,0,s);q.s('S',0,0,0,.07,.06,.08,col||0x2e1065);[-1,1].forEach(j=>{q.s('F0',j*.04,0,.09,.02,.02,.05,col||0x2e1065);q.g('s',j*.025,-.055,.02,.012,.01,.012,0xff3030);q.s('S',j*.13,.0,.01,.11,.02,.05,0x581c87,0,0,j*.3)});return q};
 const winGrid=(c,x0,y,z0,nx,nz,dx,dz,w,h,seed)=>{for(let i=0;i<nx;i++)for(let j=0;j<nz;j++){const on=((i*7+j*13+seed)%5)<3;c[on?'g':'s']('B',x0+i*dx,y,z0+j*dz,w,.012,h,on?0xffd36b:0x2a2238)}};
 TD.bat=(c,lv,b)=>{base(c,lv,0x3f3448);const BW=0x5b4a6e;
  if(lv===1){c.s('B',0,0,.3,.42,.36,.42,BW);winGrid(c,-.12,-.185,.18,3,3,.12,.11,.07,.06,1);c.s('B',0,0,.53,.46,.4,.04,0x2e2438);c.s('C',.12,.08,.6,.05,.05,.1,0x9ca3af);batF(c,-.06,.0,.62,1);
   c.s('B',.0,-.205,.49,.2,.04,.04,0x2e2438);return}
  if(lv===2){c.s('B',0,.02,.32,.46,.4,.46,0x6a5580);c.s('B',0,-.19,.2,.12,.02,.22,0x3b2a4a);c.g('B',-.14,-.185,.38,.13,.012,.12,0xffd36b);batF(c,-.14,-.2,.38,.5,0x1e0a3c);
   c.s('B',.14,-.2,.3,.14,.05,.02,0x9ca3af);c.s('B',.14,-.2,.42,.12,.04,.1,0xe5e7eb);c.s('W',0,.02,.55,.5,.44,.16,0x7e3a5a);batF(c,0,.02,.75,1.2);return}
  if(lv===3){c.s('B',0,0,.52,.4,.36,.86,0x5b4a6e);winGrid(c,-.12,-.185,.2,3,6,.12,.12,.08,.07,3);c.s('B',0,0,.97,.44,.4,.04,0x2e2438);c.g('B',0,-.1,1.03,.26,.03,.08,0xf472b6);batF(c,.12,.1,1.06,1);return}
  c.s('B',0,0,.48,.38,.34,.78,0x4b3b5e);winGrid(c,-.11,-.175,.2,3,5,.11,.12,.075,.07,5);c.s('B',0,0,.88,.42,.38,.03,GD);c.t('B',0,0,.99,.3,.28,.2,0x9fd8ff);c.s('B',0,0,1.1,.34,.32,.03,GD);
  c.g('C',.1,-.08,.905,.08,.06,.01,0x38bdf8);batF(c,-.06,.03,1.0,1.1,0x3b0764);return [-.06,.03,1.07,.05]};
 // 🧪 조류독감 AI → AI2.0 → AI 프로 → 초지능
 const flask=(c,x,y,z,s,liq,mask)=>{c.g('S',x,y,z-.03*s,.2*s,.2*s,.15*s,liq);c.t('S',x,y,z,.25*s,.25*s,.23*s,0xd6ffe4);c.t('C',x,y,z+.3*s,.07*s,.07*s,.2*s,0xd6ffe4);c.s('C',x,y,z+.42*s,.075*s,.075*s,.06*s,0x9a6a3a);
  if(mask){const m=c.sub(x,y-.22*s,z-.02*s,-.3,0,0,s);m.s('B',0,0,0,.22,.04,.13,0xbfdcff);m.s('B',0,-.022,0,.2,.01,.015,0x9cc0f0);m.s('B',0,-.022,.035,.2,.01,.01,0x9cc0f0);c.s('T.06',x,y,z+.01*s,.25*s,.25*s,.25*s,WHC);eyes(c,x,y-.2*s,z+.11*s,.035*s,.07*s)}};
 const bubbles=(c,z,r,n,col,v)=>{const s=c.spin(0,0,z,v||1.8);for(let i=0;i<n;i++){const a=i*PI*2/n;s.g('s',Math.cos(a)*r,Math.sin(a)*r,(i%3)*.06,.03+(i%2)*.015,.03+(i%2)*.015,.03+(i%2)*.015,col)}return s};
 const brain=(c,x,y,z,r)=>{for(let i=0;i<9;i++){const a=i*2.4,h=(i%3)/3;c.s('S',x+Math.cos(a)*r*.45,y+Math.sin(a)*r*.45,z+h*r*.4,r*.5,r*.5,r*.45,i%2?0xf9a8d4:0xf472b6)}};
 TD.flu=(c,lv,b)=>{base(c,lv);const LQ=0x4ade80;
  if(lv===1){[0,1,2].forEach(i=>{const a=PI/2+i*2.094;c.seg('s',Math.cos(a)*.24,Math.sin(a)*.24,.1,Math.cos(a)*.16,Math.sin(a)*.16,.3,.02,MT)});c.s('T.1',0,0,.3,.17,.17,.17,MT);flask(c,0,0,.47,1,LQ,1);bubbles(c,.85,.12,3,0xbbf7d0);return}
  if(lv===2){c.s('B',0,0,.14,.5,.5,.05,0x14532d);for(let i=0;i<5;i++)[-1,1].forEach(k=>{c.s('B',-.2+i*.1,k*.26,.12,.03,.04,.02,GD);c.s('B',k*.26,-.2+i*.1,.12,.04,.03,.02,GD)});c.s('B',0,0,.18,.26,.26,.04,0x1f2937);
   flask(c,-.06,.03,.42,1.0,LQ,1);flask(c,.24,-.14,.3,.45,0x22d3ee);c.s('C',-.06,.03,.93,.008,.008,.12,DKC);c.g('s',0,0,1.02,.03,.03,.03,0x22d3ee);[[-.15,-.18],[.15,-.18]].forEach(([x,y],i)=>c.g('s',x,y,.21,.02,.02,.02,i?0x22d3ee:LQ));bubbles(c,.8,.16,4,0xbbf7d0);return}
  if(lv===3){c.s('C',0,0,.13,.3,.3,.06,0x1f2937);flask(c,0,0,.44,1.1,0x86efac,1);brain(c,0,0,.42,.13);const mo=c.sub(0,-.27,.66,-.35);mo.s('B',0,0,0,.2,.03,.13,0x1f2937);mo.g('B',0,-.016,0,.17,.01,.1,0x38bdf8);[-1,1].forEach(k=>mo.s('B',k*.04,-.022,.015,.025,.01,.03,BLK));mo.s('A.15,3.14',0,-.022,-.015,.025,.025,.025,BLK,PI/2,0,PI);
   c.s('B',.27,.12,.2,.14,.08,.04,0x8a5a2b);[0x22c55e,0xa855f7,0xfacc15].forEach((col,i)=>{c.t('C',.22+i*.05,.12,.33,.02,.02,.22,0xffffff);c.g('C',.22+i*.05,.12,.28,.017,.017,.12,col)});bubbles(c,.85,.18,5,0xbbf7d0);return}
  c.s('C',0,0,.14,.38,.38,.08,0x1f2937);for(let i=0;i<8;i++){const a=i*PI/4;c.g('B',Math.cos(a)*.28,Math.sin(a)*.28,.185,.12,.015,.01,0x22d3ee,0,0,a)}brain(c,0,0,.42,.24);c.t('H',0,0,.18,.36,.36,.5,0xd6ffe4);
  const m=c.sub(0,-.33,.33,-.5);m.s('B',0,0,0,.26,.04,.14,0xbfdcff);eyes(c,0,-.27,.5,.05,.09);bubbles(c,.75,.38,6,0xbbf7d0,1.2);return [0,0,.7,.075]};
 // 🫧 식초 늪 → 사과식초 늪 → 피클 절임 늪 → 전설의 초절임 늪
 const swamp=(c,r)=>{c.s('C',0,0,.105,r,r,.02,0x3f6212);c.t('C',0,0,.12,r*.95,r*.95,.02,0xc5f04a);[[.27,.18],[-.25,.2],[-.2,-.24]].forEach(([x,y])=>{c.s('C',x,y,.13,.06,.06,.01,0x4d7c0f)})};
 const reeds=(c,list)=>list.forEach(([x,y,h])=>{c.s('F0',x,y,.1+h/2,.015,.015,h,0x65a30d);c.s('C',x,y,.1+h*.75,.02,.02,h*.2,0x7a4a26)});
 const bottle=(c,x,y,z,s,ry,col)=>{const q=c.sub(x,y,z,0,ry||0,0,s);q.t('C',0,0,0,.08,.08,.26,col||0xf0c860);q.g('C',0,0,-.03,.06,.06,.18,0xe8b440);q.t('F.45',0,0,.16,.08,.08,.08,col||0xf0c860);q.s('C',0,0,.23,.035,.035,.06,RDC);q.s('B',0,-.082,0,.1,.01,.1,WHC);return q};
 TD.acid=(c,lv,b)=>{base(c,lv,0x3f4a2a);
  if(lv===1){swamp(c,.38);bottle(c,.04,.02,.24,1.1,.6);reeds(c,[[-.25,.15,.5],[-.3,.05,.4],[.28,.2,.42]]);bubbles(c,.18,.2,4,0xd9f99d,1);return}
  if(lv===2){swamp(c,.39);bottle(c,-.1,.06,.26,1.15,.5,0xf3b06a);c.s('S',.16,-.1,.17,.08,.08,.075,0xdc2626);c.s('C',.16,-.1,.26,.008,.008,.05,0x5a3a1a);c.s('S',.19,-.1,.27,.035,.012,.018,0x22c55e,0,.4);
   reeds(c,[[-.27,.2,.5],[.27,.2,.45]]);bubbles(c,.2,.22,5,0xd9f99d,1.2);return}
  if(lv===3){swamp(c,.4);c.t('C',0,0,.4,.2,.2,.56,0xd9fbe0);c.g('C',0,0,.34,.18,.18,.4,0x9bd44a);[[.07,.04,.36],[-.07,-.02,.42],[0,.08,.3],[-.02,-.08,.28]].forEach(([x,y,z],i)=>c.s('S',x,y,z,.045,.045,.13,0x4d7c0f,.2*i,.3));
   c.s('C',0,0,.7,.21,.21,.05,RDC);c.s('C',0,0,.735,.17,.17,.02,0xf87171);reeds(c,[[-.3,.2,.45],[.3,.18,.38]]);bubbles(c,.2,.3,5,0xd9f99d);return}
  swamp(c,.41);c.s('S',0,0,.42,.3,.3,.32,0x7a4a26);c.s('C',0,0,.72,.2,.2,.06,0x6b3f1f);c.s('T.2',0,0,.75,.2,.2,.2,GD);c.s('T.12',0,0,.46,.305,.305,.2,GD);c.g('C',0,0,.755,.17,.17,.01,0xa3e635);
  [[.07,.04,.85],[-.08,-.02,.88],[0,.09,.82],[-.03,-.09,.8]].forEach(([x,y,z],i)=>c.s('S',x,y,z,.045,.045,.13,0x3f6212,.25*(i-1.5),.3));bubbles(c,.2,.36,6,0xecfccb);return [0,0,.98,.06]};
 // ♨️ 불한증막 사우나 → 냉온탕 사우나 → 때밀이 사우나 → 목욕탕 대왕궁
 const hut=(c,x,y,z,w,d,h,col,roof)=>{c.s('B',x,y,z+h/2,w,d,h,col);for(let i=1;i<4;i++)c.s('B',x,y-d/2-.002,z+i*h/4,w,.01,.012,dkn(col,.7));c.s('W',x,y,z+h,w*1.18,d*1.15,h*.55,roof);c.s('B',x,y-d/2-.003,z+h*.3,w*.26,.01,h*.6,0x4a2a14)};
 const onsen=(c,x,y,z,s)=>{const q=c.sub(x,y,z,-.5,0,0,s);q.g('A.12,3.14',0,0,0,.06,.06,.06,0xff4d4d,PI/2,0,PI);[-1,0,1].forEach(k=>q.g('B',k*.04,0,.08,.016,.016,.07,0xff4d4d,0,k*.25))};
 const tub=(c,x,y,r,col)=>{c.s('C',x,y,.15,r,r,.08,0x8a5a2b);c.g('C',x,y,.19,r*.85,r*.85,.01,col)};
 TD.steam=(c,lv,b)=>{base(c,lv);const LOG=0xa0663a;
  if(lv===1){hut(c,0,.03,.1,.42,.36,.32,LOG,0x7a3b2a);c.s('C',.13,.12,.6,.05,.05,.24,0x8a8a8a);puff(c,'w',.13,.12,.78,.07,0xffffff);puff(c,'w',.16,.1,.94,.09,0xffffff);onsen(c,0,-.2,.5,1);return}
  if(lv===2){hut(c,0,.1,.1,.42,.3,.32,LOG,0x7a3b2a);c.s('C',.13,.16,.6,.05,.05,.24,0x8a8a8a);puff(c,'w',.13,.16,.8,.08,0xffffff);tub(c,-.18,-.2,.12,0xff6a3a);tub(c,.18,-.2,.12,0x38bdf8);puff(c,'w',-.18,-.2,.32,.05,0xffffff);onsen(c,0,-.06,.5,1);return}
  if(lv===3){hut(c,0,.06,.1,.46,.34,.34,LOG,0x7a3b2a);c.s('C',-.14,.14,.62,.05,.05,.24,0x8a8a8a);puff(c,'w',-.14,.14,.82,.08,0xffffff);const m=c.sub(.1,.04,.66,0,.3,.2);m.s('B',0,0,0,.16,.06,.2,0x16a34a);for(let i=0;i<4;i++)m.s('B',0,-.032,-.07+i*.05,.16,.01,.012,0x0f7a35);
   tub(c,.25,-.24,.08,0xff6a3a);c.s('C',-.25,-.24,.17,.06,.06,.1,0xfacc15);onsen(c,0,-.12,.52,1);return}
  c.s('B',0,.05,.24,.62,.44,.28,0xb37440);for(let i=-2;i<=2;i++)c.s('C',i*.13,-.18,.24,.025,.025,.28,0x8b1d1d);c.s('W',0,.05,.38,.72,.52,.14,0x1f5f5b,0,0,PI/2);c.s('B',0,.06,.58,.36,.28,.18,0xb37440);c.s('W',0,.06,.67,.46,.34,.14,0x1f5f5b,0,0,PI/2);
  c.s('B',0,.06,.81,.04,.36,.02,GD);c.s('C',.24,.18,.62,.05,.05,.5,0x8a8a8a);puff(c,'w',.24,.18,.93,.08,0xffffff);onsen(c,0,-.15,.62,1.4);return [0,.06,.84,.06]};
 // 🔆 전자레인지 포 → 해동모드 레인지포 → 땡땡땡 레인지포 → 우주 전자레인지
 const micro=(c,x,y,z,w,h,glow,inside)=>{c.s('B',x,y,z,w,w*.72,h,0xe9e5df);c.s('B',x-w*.1,y-w*.362,z,w*.62,.012,h*.7,0x1f2937);c.g('B',x-w*.1,y-w*.355,z,w*.5,.01,h*.5,glow);
  c.s('B',x+w*.33,y-w*.362,z,w*.2,.012,h*.8,0x9ca3af);c.g('B',x+w*.33,y-w*.37,z+h*.25,w*.14,.01,h*.12,0x4ade80);[0,1].forEach(i=>c.s('s',x+w*.33,y-w*.37,z-h*(.05+i*.18),.02,.01,.02,0x333333));if(inside)inside(x-w*.1,y,z)};
 const bell=(c,x,y,z,s)=>{c.s('H',x,y,z,.07*s,.07*s,.1*s,GD);c.s('T.2',x,y,z,.07*s,.07*s,.05*s,0xe0a820);c.s('s',x,y,z-.02*s,.02*s,.02*s,.02*s,0xb07a15);c.s('C',x,y,z+.11*s,.012*s,.012*s,.04*s,MT)};
 const plasmaGun=(c,x,y,z,e,r)=>{const g=c.sub(x,y,z,fwd(e));g.s('C',0,0,.12,r,r,.28,0x6b7280);[.05,.17].forEach(zz=>g.g('T.3',0,0,zz,r*1.1,r*1.1,r*1.1,0xfb923c));g.g('S',0,0,.3,r*.9,r*.9,r*.9,0xfff1c2);return g};
 TD.plasma=(c,lv,b)=>{base(c,lv);
  if(lv===1){c.s('C',0,0,.14,.3,.3,.07,DKC);micro(c,0,0,.34,.5,.3,0xffb347);plasmaGun(c,0,.02,.5,.7,.06);return}
  if(lv===2){c.s('C',0,0,.14,.32,.32,.07,DKC);micro(c,0,0,.36,.54,.34,0x7dd3fc,(x,y,z)=>c.s('S',x,y-.1,z,.1,.03,.04,0x60a5fa));c.g('O',.18,-.2,.47,.02,.01,.04,0xbae6fd);plasmaGun(c,-.1,.02,.54,.75,.06);plasmaGun(c,.1,.02,.54,.75,.06);return}
  if(lv===3){c.s('C',0,0,.14,.32,.32,.07,DKC);micro(c,0,.02,.36,.56,.34,0xffd166);[-.17,0,.17].forEach((x,i)=>bell(c,x,.12,.6+(i===1?.04:0),1));plasmaGun(c,0,-.06,.55,.7,.08);
   const s=c.spin(0,0,.62,2);[0,2.1,4.2].forEach(a=>s.g('O',Math.cos(a)*.34,Math.sin(a)*.34,.1,.03,.03,.06,0xfff3a0));return}
  c.s('C',0,0,.14,.3,.3,.07,DKC);[-1,1].forEach(k=>c.a('F0',k*.14,.1,.18,.06,.06,.14,0x7dd3fc,PI));micro(c,0,0,.4,.48,.3,0xc084fc);c.s('T.06',0,0,.4,.42,.42,.42,GD,.35);plasmaGun(c,0,.02,.56,.8,.07);
  c.s('C',.15,.12,.62,.012,.012,.12,DKC);const dd=c.sub(.15,.12,.7,-.6);dd.s('H',0,0,0,.11,.11,.04,0xe5e7eb,PI);dd.s('C',0,0,.03,.008,.008,.07,DKC);dd.g('s',0,0,.07,.02,.02,.02,0xfb923c);return [-.12,.05,.56,.05]};
 // 🎇 불맛 회오리 → 웍질 회오리 → 불쇼 대회오리 → 중화요리 신의 웍
 const wok=(c,x,y,z,r,col,tilt)=>{const w=c.sub(x,y,z,tilt||0);w.s('H',0,0,0,r,r,r*.5,col||0x2f2f33,PI);w.s('T.06',0,0,0,r,r,r,col||0x3f3f46);w.s('C',r*1.25,0,.02,.02,.02,r*.6,0x8a5a2b,0,PI/2);return w};
 const fireTwist=(c,x,y,z,n,r0,r1,h,v)=>{const s=c.spin(x,y,z,v);for(let i=0;i<n;i++){const t=i/(n-1),r=r0+(r1-r0)*t;s.a('T.16',Math.cos(i*1.3)*.035,Math.sin(i*1.3)*.035,t*h,r,r,r*.8,[0xff4d1a,0xff8a2b,0xffc23a][i%3])}return s};
 TD.firestorm=(c,lv,b)=>{base(c,lv);
  if(lv===1){c.s('C',0,0,.15,.2,.2,.1,0x27272a);c.g('T.15',0,0,.2,.14,.14,.14,0x60a5fa);wok(c,0,0,.36,.26);c.g('C',0,0,.3,.2,.2,.02,0xff8a2b);flames(c,.34,.09,3,.22);fireTwist(c,0,0,.38,5,.06,.2,.55,3);return}
  if(lv===2){c.s('C',0,0,.15,.2,.2,.1,0x27272a);c.g('T.15',0,0,.2,.14,.14,.14,0x60a5fa);wok(c,-.03,0,.38,.27,0,.25);fireTwist(c,0,0,.4,6,.07,.22,.62,3.4);
   const s=c.spin(0,0,.75,-2.4);s.s('S',.3,0,0,.05,.03,.025,0xf9a8a8,0,0,.5);s.s('B',-.3,0,.04,.07,.02,.02,0x22c55e,0,.5);s.s('S',0,.3,-.03,.05,.04,.02,0xfde047);return}
  if(lv===3){c.s('C',0,0,.15,.22,.22,.1,0x27272a);c.g('T.15',0,0,.2,.16,.16,.16,0x60a5fa);wok(c,0,0,.36,.28);fireTwist(c,0,0,.38,7,.08,.28,.8,3.8);wok(c,.0,.0,1.2,.12,0,0);return}
  c.s('C',0,0,.15,.22,.22,.1,0x27272a);c.g('T.15',0,0,.2,.16,.16,.16,0xff8a2b);wok(c,0,0,.37,.3,GD);fireTwist(c,0,0,.4,7,.08,.28,.72,4.2);
  const h=c.sub(0,0,1.1);h.s('C',0,0,0,.1,.1,.08,WHC);puff(h,'s',0,0,.1,.09,WHC);return null};
 // ⚗️ 마라탕 화로 → 맵기 5단계 화로 → 맵기 10단계 화로 → 맵기 측정불가
 const chili=(c,x,y,z,s,lie,a)=>{const q=c.sub(x,y,z,0,0,a||0,s).sub(0,0,0,0,lie?PI/2:.35,0);q.s('F0',0,0,0,.03,.03,.14,0xdc2626,PI);q.s('C',0,0,.08,.012,.012,.04,0x16a34a)};
 const malaBowl=(c,z,r,col)=>{c.s('H',0,0,z,r,r,r*.6,col||0xd62828,PI);c.s('T.08',0,0,z,r,r,r,col||0xd62828);c.s('T.08',0,0,z-.03,r*.99,r*.99,r*.99,GD);c.g('C',0,0,z-.01,r*.92,r*.92,.01,0xff4b1f);
  [[.1,.05],[-.08,.1],[.0,-.12],[-.13,-.05]].forEach(([x,y],i)=>c.s('B',x*r*3,y*r*3,z+.005,.045,.045,.02,i%2?0xfff7d6:0x8b5a2b,0,0,i));};
 TD.pyre=(c,lv,b)=>{base(c,lv,0x4a3a3a);
  const stand=(z)=>{[0,1,2].forEach(i=>{const a=PI/2+i*2.094;c.seg('s',Math.cos(a)*.3,Math.sin(a)*.3,.1,Math.cos(a)*.2,Math.sin(a)*.2,z,.025,DKC)});c.s('T.12',0,0,z,.2,.2,.2,DKC)};
  if(lv===1){stand(.28);flames(c,.13,.08,3,.16);malaBowl(c,.48,.28);chili(c,.08,-.05,.5,1,PI/2,.5);chili(c,-.1,.06,.5,1,PI/2,2);puff(c,'w',0,.05,.72,.07,0xffe4e6);return}
  if(lv===2){stand(.28);flames(c,.13,.1,4,.2);malaBowl(c,.48,.31);for(let i=0;i<5;i++){const a=i*PI*2/5;chili(c,Math.cos(a)*.27,Math.sin(a)*.27,.6,1,0,a)}puff(c,'w',0,0,.78,.08,0xffd4d4);return}
  if(lv===3){stand(.3);flames(c,.12,.14,6,.3);malaBowl(c,.52,.33,0xb91c1c);for(let i=0;i<7;i++){const a=i*PI*2/7;chili(c,Math.cos(a)*.29,Math.sin(a)*.29,.64,1.1,0,a)}const f=c.spin(0,0,.55,3);for(let i=0;i<4;i++){const a=i*PI/2;f.a('F0',Math.cos(a)*.18,Math.sin(a)*.18,.12,.05,.05,.24,0xff6a1a)}return}
  stand(.3);flames(c,.12,.14,6,.3);malaBowl(c,.52,.33,0x991b1b);const f=c.spin(0,0,.55,3.5);for(let i=0;i<6;i++){const a=i*PI/3;f.a('F0',Math.cos(a)*.2,Math.sin(a)*.2,.16,.06,.06,.32,i%2?0xffd166:0xff4d1a)}
  const g=c.sub(.2,.2,.75,-.5);g.s('C',0,0,0,.11,.11,.03,WHC,PI/2);g.s('T.15',0,0,0,.11,.11,.11,GD,PI/2);g.s('B',.03,-.02,.03,.012,.01,.1,RDC,0,-1.1);g.s('B',-.04,-.025,-.02,.04,.01,.035,0x111111,0,.6);
  for(let i=0;i<5;i++){const a=i*PI*2/5;chili(c,Math.cos(a)*.15,Math.sin(a)*.15,.62,1,0,a)}return [0,0,.68,.07]};
 // 🌌 냉동 전기장판 → 배신의 전기장판 → 북극 전기장판 → 오로라 대장판
 const mat2=(c,z,w,d,col,wire)=>{c.s('B',0,0,z,w,d,.05,col);for(let i=0;i<4;i++)c.g('B',0,-d*.36+i*d*.24,z+.027,w*.84,.012,.006,i%2?wire:0x7dd3fc);[-1,1].forEach(k=>c.g('B',k*w*.42,0,z+.027,.012,d*.74,.006,wire));
  c.s('S',0,d*.32,z+.05,w*.3,d*.14,.04,WHC)};
 const remote=(c,x,y,z,col)=>{c.s('B',x,y,z,.1,.07,.05,WHC);c.g('s',x,y-.036,z+.005,.02,.01,.02,col);c.seg('s',x,y+.035,z,x-.04,y+.12,z-.05,.008,0x333333)};
 TD.aurora=(c,lv,b)=>{base(c,lv);const MB=0x93c5fd;
  if(lv===1){c.s('B',0,0,.13,.62,.44,.06,0x8a5a2b);mat2(c,.19,.58,.4,MB,0xfb923c);remote(c,.22,-.2,.24,0x7dd3fc);for(let i=0;i<5;i++){const a=i*1.26+.3;c.t('F0',Math.cos(a)*.22,Math.sin(a)*.14,.28,.035,.035,.14+(i%2)*.06,0xbfe9ff)}c.t('O',-.08,-.03,.42,.085,.085,.24,0xbfe9ff);c.g('O',-.08,-.03,.42,.035,.035,.11,0xffffff);return}
  if(lv===2){c.s('B',0,0,.13,.62,.44,.06,0x8a5a2b);mat2(c,.19,.58,.4,0x7fb4f5,0xf43f5e);remote(c,.22,-.2,.24,0xf43f5e);for(let i=0;i<6;i++){const a=i*1.05;c.t('F0',Math.cos(a)*.24,Math.sin(a)*.15,.3,.035,.035,.18+(i%2)*.06,0xbfe9ff)}
   const f=c.sub(0,.13,.26,-.4);[-1,1].forEach(k=>{f.s('s',k*.05,-.04,0,.016,.01,.016,BLK);f.s('B',k*.05,-.045,.025,.04,.01,.01,BLK,0,k*.5)});c.t('O',-.1,-.04,.4,.07,.07,.2,0xbfe9ff);return}
  if(lv===3){c.t('D',0,0,.16,.42,.38,.14,0xdff3ff);mat2(c,.27,.56,.4,MB,0xfb923c);[[.26,.18],[-.26,-.17]].forEach(([x,y])=>c.s('S',x,y,.3,.09,.09,.06,WHC));c.t('O',-.08,-.03,.5,.08,.08,.24,0xbfe9ff);c.t('O',.12,.06,.44,.05,.05,.15,0xbfe9ff);remote(c,.22,-.22,.32,0x7dd3fc);return}
  c.t('D',0,0,.16,.42,.38,.14,0xdff3ff);mat2(c,.27,.56,.4,0xa5b4fc,GD);c.t('O',0,-.02,.52,.08,.08,.26,0xbfe9ff);c.g('O',0,-.02,.52,.035,.035,.12,0xffffff);
  const s=c.spin(0,0,.3,.6);[[0,.36,0x4ade80],[2.1,.3,0xa78bfa],[4.2,.33,0x22d3ee]].forEach(([a,r,col])=>{for(let i=0;i<5;i++){const t=a+i*.22;s.a('B',Math.cos(t)*r,Math.sin(t)*r,.35,.09,.01,.5-Math.abs(i-2)*.08,col,0,0,t+PI/2)}});return [0,-.02,.78,.055]};
 // 🌬️ 빙수 블렌더 → 팥빙수 블렌더 → 눈꽃빙수 믹서 → 전설의 빙수장인
 const blender=(c,s,col,top)=>{c.s('C',0,0,.2,.2*s,.2*s,.2,col);c.s('B',0,-.2*s,.2,.12*s,.02,.06,0x1f2937);[-1,1].forEach(k=>c.g('s',k*.04*s,-.21*s,.2,.015,.01,.015,k>0?0xf87171:0x4ade80));
  c.t('F1.25',0,0,.53,.14*s,.14*s,.42,0xe0f7ff);for(let i=0;i<5;i++){const a=i*2.4;c.s('s',Math.cos(a)*.07*s,Math.sin(a)*.07*s,.4+i*.04,.045*s,.045*s,.04*s,WHC)}
  const b=c.spin(0,0,.36,14),bl=col===GD?GD:MT;b.s('B',0,0,0,.2*s,.03,.01,bl);b.s('B',0,0,0,.03,.2*s,.01,bl,0,.3);if(top!==false)c.s('C',0,0,.76,.18*s,.18*s,.04,col);return .78};
 TD.whiteout=(c,lv,b)=>{base(c,lv);const MC2=0x5eead4;
  if(lv===1){blender(c,1,MC2);c.s('C',0,0,.8,.04,.04,.04,WHC);const s=c.spin(0,0,.5,-2.5);for(let i=0;i<4;i++){const a=i*PI/2;s.g('s',Math.cos(a)*.3,Math.sin(a)*.3,(i%2)*.15,.025,.025,.025,0xffffff)}return}
  if(lv===2){blender(c,1.05,MC2,false);c.s('C',0,0,.76,.19,.19,.02,0xbfe9ff);c.s('S',0,0,.79,.17,.17,.15,0xffffff);for(let i=0;i<8;i++){const a=i*2.4,r=.03+.1*Math.sqrt(i/8);c.s('s',Math.cos(a)*r,Math.sin(a)*r,.9+.02*(i%2),.03,.03,.022,0x7f1d1d)}[[.1,-.08],[-.1,.05]].forEach(([x,y])=>c.s('B',x,y,.88,.045,.045,.04,0xfdf6e3));return}
  if(lv===3){blender(c,1.1,0x2dd4bf);const f=c.spin(0,0,.98,1);for(let i=0;i<3;i++){f.g('B',0,0,0,.3,.028,.02,0xe0fbff,0,0,i*PI/3);[-1,1].forEach(k=>f.g('B',Math.cos(i*PI/3)*k*.12,Math.sin(i*PI/3)*k*.12,0,.08,.02,.02,0xe0fbff,0,0,i*PI/3+PI/2))}c.s('C',0,0,.86,.015,.015,.16,WHC);
   const s=c.spin(0,0,.4,-3);for(let i=0;i<6;i++){const a=i*PI/3;s.g('s',Math.cos(a)*.32,Math.sin(a)*.32,(i%3)*.15,.03,.03,.03,0xffffff)}return}
  blender(c,1.1,GD);const h=c.sub(0,0,.8);h.s('C',0,0,.06,.12,.12,.1,WHC);puff(h,'s',0,0,.17,.1,WHC);const s=c.spin(0,0,.4,-3);for(let i=0;i<6;i++){const a=i*PI/3;s.g('s',Math.cos(a)*.33,Math.sin(a)*.33,(i%3)*.15,.03,.03,.03,0xffffff)}return null};
 // 🧊 유통기한 아이스크림 → 세기말 → 빙하기산 → 공룡시대
 const cone=(c,z,r,h,col)=>{c.s('F0',0,0,z-h/2,r,r,h,col||0xd9a35a,PI);for(let i=0;i<3;i++)c.s('T.15',0,0,z-h*(.2+i*.22),r*(.8-i*.22),r*(.8-i*.22),r*(.8-i*.22),0xb7803a)};
 const scoop=(c,x,y,z,r,col,drip)=>{c.s('S',x,y,z,r,r,r*.85,col);c.s('T.35',x,y,z-r*.45,r*.9,r*.9,r*.6,col);if(drip)for(let i=0;i<3;i++){const a=i*2.1+.4;c.g('S',x+Math.cos(a)*r*.85,y+Math.sin(a)*r*.85,z-r*.6,.03,.03,.07,0x84cc16)}};
 const flies=(c,z,r,n)=>{const s=c.spin(0,0,z,2.4);for(let i=0;i<n;i++){const a=i*PI*2/n;s.s('s',Math.cos(a)*r,Math.sin(a)*r,(i%2)*.05,.02,.02,.02,0x18181b);s.t('S',Math.cos(a)*r,Math.sin(a)*r,.025+(i%2)*.05,.025,.012,.006,0xffffff)}};
 TD.frostbane=(c,lv,b)=>{base(c,lv);const MN=0x5eead4;
  if(lv===1){c.s('T.15',0,0,.25,.13,.13,.13,MT);[0,1,2].forEach(i=>{const a=PI/2+i*2.094;c.seg('s',Math.cos(a)*.13,Math.sin(a)*.13,.25,Math.cos(a)*.2,Math.sin(a)*.2,.1,.015,MT)});cone(c,.62,.15,.48);scoop(c,0,0,.72,.18,MN,1);
   c.s('B',0,-.11,.44,.1,.01,.06,RDC,.35);flies(c,.98,.15,2);return}
  if(lv===2){c.g('C',0,0,.11,.3,.3,.01,0x84cc16);cone(c,.58,.15,.46);scoop(c,0,0,.68,.17,0xa78bfa,1);scoop(c,0,0,.88,.15,MN,1);c.s('B',0,-.11,.42,.1,.01,.06,RDC,.35);flies(c,1.08,.18,3);return}
  if(lv===3){c.t('B',0,0,.36,.4,.4,.52,0xbfe9ff);cone(c,.58,.13,.4);scoop(c,0,0,.66,.15,0xa78bfa);scoop(c,0,0,.84,.14,MN,1);scoop(c,0,0,1.0,.12,0xf9a8d4,1);flies(c,1.12,.18,3);return}
  cone(c,.6,.16,.48,GD);scoop(c,0,0,.72,.19,0x84cc16,1);scoop(c,0,0,.92,.16,MN,1);for(let i=0;i<4;i++)c.s('F0',0,.06-i*.06,1.04-i*.03+(i===0?.02:0),.03,.03,.08,0xf97316,-.3+i*.25);
  c.s('C',.24,-.16,.18,.025,.025,.2,CRM,0,PI/2,.5);[-1,1].forEach(k=>c.s('S',.24+k*.09,-.16+k*.05,.18,.035,.035,.035,CRM));flies(c,1.14,.2,3);return [0,.1,1.04,.05]};
 // 🗼 태풍경보 탑 → 재난문자 송신탑 → 슈퍼태풍 경보탑 → 태풍의 눈 관제탑
 const siren=(c,z,n,v)=>{const s=c.spin(0,0,z,v||0);for(let i=0;i<n;i++){const a=i*PI*2/n,C2=Math.cos(a),S2=Math.sin(a);s.seg('s',C2*.05,S2*.05,0,C2*.24,S2*.24,0,.035,0xd1d5db,'F2.6');s.seg('s',C2*.235,S2*.235,0,C2*.245,S2*.245,0,.088,0x374151)}return s};
 TD.tempest=(c,lv,b)=>{base(c,lv);const TW=0x8f9bd6;
  if(lv===1){c.s('f.6',0,0,.46,.15,.15,.72,TW);c.s('C',0,0,.84,.17,.17,.04,0x4b5563);siren(c,.94,2,0);c.g('H',0,0,1.0,.07,.07,.08,0xff3b3b);const r=c.spin(0,0,1.03,4);[-1,1].forEach(k=>r.a('F.2',k*.22,0,0,.05,.05,.32,0xff6b6b,0,k*PI/2));return}
  if(lv===2){c.s('f.6',0,0,.46,.16,.16,.72,TW);c.s('C',0,0,.84,.17,.17,.04,0x4b5563);siren(c,.94,2,0);c.s('C',0,0,1.16,.012,.012,.34,DKC);c.g('s',0,0,1.33,.025,.025,.025,0xff3b3b);
   const p=c.sub(.2,-.1,.55,-.4);p.s('B',0,0,0,.14,.03,.24,0x1f2937);p.g('B',0,-.017,.0,.11,.01,.19,0xfde047);p.s('B',0,-.023,.02,.02,.01,.08,BLK);p.s('s',0,-.023,-.05,.012,.01,.012,BLK);
   const w=c.spin(0,0,1.18,1.5);[.12,.2].forEach(r=>w.a('T.06',0,0,0,r,r,r,0xfde047));return}
  if(lv===3){c.s('f.6',0,0,.5,.17,.17,.8,0x7c86c8);c.s('C',0,0,.92,.18,.18,.04,0x4b5563);siren(c,1.02,4,1.8);c.g('H',0,0,1.09,.07,.07,.08,0xff3b3b);const sw=c.spin(0,0,.3,-2.5);for(let i=0;i<3;i++)sw.a('A.05,3',0,0,i*.18,.3-i*.04,.3-i*.04,.3-i*.04,0xa5f3fc,0,0,i*2);return}
  c.s('C',0,0,.4,.1,.1,.6,0xcbd5e1);c.s('F1.4',0,0,.74,.15,.15,.08,0x64748b);c.t('f1.15',0,0,.86,.17,.17,.16,0x7dd3fc);c.s('f.8',0,0,.97,.22,.22,.05,0x475569);siren(c,.65,2,0);
  const e=c.spin(0,0,1.05,2.2);for(let i=0;i<3;i++)e.a('A.08,2.4',0,0,.0,.25,.25,.15,0xa5f3fc,0,0,i*2.09);c.s('S',0,0,1.05,.085,.085,.07,0xffffff);c.s('S',0,-.03,1.08,.045,.045,.04,0x1e3a8a);c.s('s',0,-.04,1.1,.022,.022,.02,BLK);c.g('s',.015,-.06,1.11,.01,.01,.01,0xffffff);return null};
 // 🔋 문어발 콘센트 → 대왕문어발 콘센트 → 멀티탭의 멀티탭 → 전설의 문어발왕
 const strip=(c,x,y,z,len,rz,col)=>{const q=c.sub(x,y,z,0,0,rz||0);q.s('B',0,0,0,len,.16,.07,col||WHC);q.g('s',len*.42,-.04,.04,.015,.015,.015,0xff3b3b);for(let i=0;i<3;i++){const xx=(i-1)*len*.28;q.s('C',xx,0,.036,.045,.045,.005,0x334155)}return q};
 const octo=(c,x,y,z,s,col,n)=>{const q=c.sub(x,y,z,0,0,0,s);q.s('S',0,0,.1,.17,.16,.19,col);eyes(q,0,-.14,.1,.045,.065);q.s('S',0,-.155,.04,.03,.02,.025,0xec4899);
  for(let i=0;i<n;i++){const a=-PI/2+(i+.5)*PI*2/n;for(let j=0;j<5;j++){const t=j/4,r=.13+t*.18,zz=-.04-t*.14+Math.sin(t*3)*.03;q.s('S',Math.cos(a+t*.6)*r,Math.sin(a+t*.6)*r,zz,.045*(1-t*.4),.045*(1-t*.4),.04*(1-t*.4),j%2?ltn(col,.2):col)}}return q};
 TD.venomvolt=(c,lv,b)=>{base(c,lv);const OC=0xa855f7,LM=0xbef264;
  if(lv===1){strip(c,0,.08,.14,.56,0);[-.16,0,.16].forEach(x=>{c.s('B',x,.08,.21,.06,.05,.08,WHC);c.seg('s',x,.08,.25,x*.5,-.02,.5,.018,0x1f2937)});octo(c,0,-.02,.52,1,OC,6);sparks(c,.35,.33,4,4);return}
  if(lv===2){strip(c,0,0,.14,.58,.5);strip(c,0,0,.21,.58,-.5);octo(c,0,0,.56,1.25,0x9333ea,8);sparks(c,.38,.36,6,4.5);return}
  if(lv===3){strip(c,0,0,.14,.58,.2);[-.18,.18].forEach((x,i)=>{c.s('B',x,0,.25,.06,.05,.12,WHC);strip(c,x*.6,.0,.36+i*.14,.4,i?-.8:.9,0xf1f5f9)});octo(c,0,0,.78,.9,0x9333ea,6);sparks(c,.45,.38,8,5);return}
  strip(c,0,0,.14,.6,.3,GD);strip(c,0,0,.21,.58,-.6,0xfff1a8);octo(c,0,0,.58,1.3,0x7e22ce,8);const s=sparks(c,.4,.4,8,5);return [0,0,.9,.06]};
 // 🌫️ 방귀 선풍기 → 고구마 방귀 선풍기 → 청국장 방귀 선풍기 → 범인 없는 방귀폭풍
 const fart=(c,n,z0,col)=>{const s=c.spin(0,-.1,z0,-1.4);for(let i=0;i<n;i++){const a=i*PI*2/n;puff(s,'w',Math.cos(a)*.26,Math.sin(a)*.26,(i%2)*.1,.06+(i%3)*.012,ltn(col,.35))}return s};
 TD.miasma=(c,lv,b)=>{const bc=b.col||0x86efac;base(c,lv);
  if(lv===1){fanBase(c,bc,.26);c.s('C',0,0,.42,.035,.035,.56,WHC);fanHead(c,{z:.76,el:.85,r:.24,nb:4,col:bc,v:7});fart(c,3,.95,0xa3e635);return}
  if(lv===2){fanBase(c,bc,.26);c.s('C',0,0,.42,.035,.035,.56,WHC);fanHead(c,{z:.76,el:.85,r:.25,nb:4,col:bc,v:8});c.s('S',-.24,-.12,.2,.07,.16,.07,0x9d3a5a,0,0,.6);c.s('S',-.15,-.24,.2,.05,.03,.05,0xfde68a,0,0,.6);fart(c,4,.95,0xa3e635);return}
  if(lv===3){fanBase(c,bc,.26);c.s('C',0,0,.42,.035,.035,.56,WHC);fanHead(c,{z:.78,el:.85,r:.27,nb:5,col:0x4ade80,v:9});c.s('S',.24,-.14,.22,.11,.11,.1,0x7a4a26);c.s('T.3',.24,-.14,.3,.08,.08,.08,0x5a3418);c.g('C',.24,-.14,.3,.065,.065,.01,0x84cc16);
   puff(c,'w',.24,-.14,.42,.05,0xa3e635);fart(c,5,.98,0x84cc16);return}
  const t=c.spin(0,0,.1,3);[[.08,.05],[.13,.18],[.18,.33],[.24,.5],[.3,.68]].forEach(([r,z],i)=>t.w('T.35',0,0,z,r,r,r*.8,i%2?0xbef264:0x84cc16));
  fanHead(c,{z:.62,el:.7,r:.22,nb:4,col:GD,v:9,y:-.12,bl:GD});const m=c.sub(0,-.2,.73,fwd(.7));eyes(m,0,0,.08,.04,.07);fart(c,4,.95,0xd9f99d);return [0,-.05,.95,.06]};

 const kq=lv=>(1+.07*(lv-1))/(1+.15*(lv-1));// 게임이 Lv마다 15%씩 키우므로 안쪽에서 일부 상쇄 → 실제 Lv.4는 1.21배(옆 칸 침범 방지)
 const REC={};
 function scanMeshes(g){const sc=new THREE.Mesh(GC('scanR',()=>new THREE.RingGeometry(.96,1,48)),new THREE.MeshBasicMaterial({color:0xa78bfa,transparent:true,opacity:.45,depthWrite:false}));sc.name='scan';sc.position.z=.04;g.add(sc);
  const sw=new THREE.Mesh(GC('scanW',()=>new THREE.CircleGeometry(1,24,0,.7)),new THREE.MeshBasicMaterial({color:0xc4b5fd,transparent:true,opacity:.16,depthWrite:false}));sw.name='scanw';sw.position.z=.05;g.add(sw)}
 // ---------- 🏰 종족 전용 타워 8종: 이름 맞춤 디자인 + 강화 Lv.1~4 진화 ----------
 const RSN=0x9aa4b2,RSD=0x6b7280,RBN=0xe9e5d8;
 function rMerl(c,z,w,col){[[-1,-1],[1,-1],[-1,1],[1,1],[0,-1],[0,1],[-1,0],[1,0]].forEach(([px,py])=>c.s('B',px*w,py*w,z,.09,.09,.08,col))}
 // 🏯 수호 망루 (둥지 연합): 돌 망루 → 성벽 망루 → 쌍탑 요새 → 철옹성
 TD.keep=(c,lv,b)=>{const bc=b.col||0x60a5fa;base(c,lv);
  const flag=(z,s)=>{c.s('C',0,0,z+.14*s,.012,.012,.28*s,WD2);c.s('B',.09*s,0,z+.22*s,.17*s,.012,.1*s,bc);c.s('B',.09*s,0,z+.22*s,.1*s,.014,.04*s,WHC)};
  if(lv===1){c.s('B',0,0,.4,.34,.34,.6,RSN);c.s('B',0,-.171,.18,.1,.01,.16,WD2);c.g('B',0,-.171,.52,.07,.01,.12,0xffe28a);c.s('F0',0,0,.87,.27,.27,.32,bc,0,0,PI/4);flag(1,.8);return}
  if(lv===2){c.s('B',0,0,.45,.36,.36,.7,RSN);[.25,.55,.75].forEach(z=>c.s('B',0,0,z,.375,.375,.025,RSD));c.s('B',0,0,.83,.42,.42,.06,RSD);rMerl(c,.9,.19,RSN);c.s('B',0,-.181,.2,.12,.01,.18,WD2);c.g('B',0,-.181,.55,.07,.01,.13,0xffe28a);c.g('B',0,-.181,.72,.07,.01,.1,0xffe28a);flag(.9,.9);return}
  if(lv===3){c.s('B',0,0,.5,.34,.34,.8,RSN);c.s('B',0,0,.93,.4,.4,.06,RSD);rMerl(c,1,.18,RSN);c.s('B',0,0,.3,.5,.1,.3,RSD);
   [-1,1].forEach(k=>{c.s('C',k*.27,0,.35,.1,.1,.5,RSD);c.s('F0',k*.27,0,.7,.13,.13,.2,bc);c.g('B',k*.27,-.1,.42,.03,.01,.1,0xffe28a)});
   c.s('B',0,-.176,.2,.12,.01,.18,WD2);c.s('B',0,-.176,.66,.12,.01,.3,bc);c.s('B',0,-.18,.78,.12,.01,.03,GD);c.g('B',0,-.176,.9,.06,.01,.06,0xffe28a);flag(1.04,1);return}
  c.s('B',0,0,.5,.44,.44,.9,RSN);[.3,.62,.9].forEach(z=>c.s('B',0,0,z,.46,.46,.03,RSD));c.s('B',0,0,1.0,.52,.52,.07,RSD);rMerl(c,1.08,.23,RSN);
  [[-1,-1],[1,-1],[-1,1],[1,1]].forEach(([px,py])=>{c.s('C',px*.27,py*.27,.4,.09,.09,.7,RSD);c.s('F0',px*.27,py*.27,.84,.12,.12,.2,bc)});
  c.s('B',0,-.221,.2,.16,.01,.22,WD2);c.s('B',0,-.222,.2,.18,.012,.02,GD);c.s('B',0,-.222,.74,.2,.01,.4,bc);c.s('B',0,-.224,.7,.1,.012,.1,WHC);[.42,.9].forEach(z=>[-1,1].forEach(k=>c.g('B',k*.12,-.221,z,.06,.01,.1,0xffe28a)));
  c.g('S',0,0,1.2,.07,.07,.07,0xfde047);c.s('C',0,0,1.18,.012,.012,.2,WD2);return [0,0,1.32,.075]};
 // 🔔 경보 종탑 (둥지 연합): 나무 종 → 지붕 종탑 → 석조 종루 → 보신각
 const rBell=(c,x,y,z,s,col)=>{c.s('H',x,y,z+.02*s,.13*s,.13*s,.15*s,col);c.s('C',x,y,z,.145*s,.145*s,.035*s,ltn(col,.2));c.s('S',x,y,z-.03*s,.03*s,.03*s,.03*s,DKC);c.s('C',x,y,z+.17*s,.02*s,.02*s,.04*s,WD2)};
 TD.bell=(c,lv,b)=>{base(c,lv);
  if(lv===1){[-1,1].forEach(k=>c.s('C',k*.2,0,.4,.028,.028,.8,WD2));c.s('B',0,0,.8,.5,.06,.06,WD2);c.s('C',0,0,.76,.008,.008,.08,WD2);rBell(c,0,0,.52,1.1,GD);return}
  if(lv===2){[-1,1].forEach(k=>c.s('C',k*.24,0,.42,.03,.03,.84,WD2));c.s('B',0,0,.84,.58,.07,.07,WD2);c.s('W',0,0,.96,.7,.42,.22,0xb4432f);c.s('C',-.1,0,.78,.008,.008,.08,WD2);rBell(c,-.1,0,.52,1,GD);c.s('C',.14,0,.8,.008,.008,.06,WD2);rBell(c,.14,0,.62,.62,0xf5c242);return}
  if(lv===3){c.s('B',0,0,.3,.42,.42,.5,RSN);[-1,1].forEach(k=>c.s('B',k*.17,0,.7,.08,.38,.32,RSN));c.s('B',0,0,.88,.46,.46,.05,RSD);c.s('F0',0,0,1.07,.34,.34,.32,0xb4432f,0,0,PI/4);
   rBell(c,0,0,.58,1.4,GD);c.s('B',0,-.211,.18,.12,.01,.2,WD2);c.s('C',0,0,1.3,.012,.012,.14,GD);c.s('B',0,0,1.34,.1,.012,.012,GD);c.s('B',0,0,1.32,.012,.012,.1,GD);return}
  c.s('B',0,0,.26,.52,.52,.42,RSN);c.s('B',0,0,.5,.56,.56,.04,RSD);[-1,1].forEach(k=>[-1,1].forEach(j=>c.s('B',k*.18,j*.18,.78,.07,.07,.5,RSN)));
  c.s('B',0,0,1.04,.5,.5,.05,RSD);c.s('W',0,0,1.18,.74,.6,.3,0xb4432f);c.s('B',0,-.261,.2,.16,.01,.24,WD2);c.s('B',0,-.262,.34,.18,.01,.02,GD);
  rBell(c,0,0,.66,2,GD);const r=c.spin(0,0,.82,1.4);[0,PI].forEach(a=>r.a('A.03,1.3',0,0,0,.4,.4,.4,0xfde68a,0,0,a));return [0,0,1.46,.07]};
 // 🗡️ 투창 노포 (맹금 군단): 투창기 → 쌍발 → 연발 → 금메달 노포
 const rBolt=(c,y0,z,len,col)=>{c.seg('s',0,y0+len/2,z,0,y0-len/2,z,.016,0xcdd3db);c.s('F0',0,y0-len/2-.04,z,.035,.035,.11,col||MT,PI/2);c.s('B',0,y0+len/2-.02,z,.07,.012,.045,RDC)};
 TD.ballista=(c,lv,b)=>{const bc=b.col||0xef4444;base(c,lv,0x5b4a3a);
  const stand=(z)=>{c.s('C',0,0,.17,.055,.055,.26,WD2);c.s('B',0,0,.1,.32,.07,.04,WD2);c.s('B',0,0,.1,.07,.32,.04,WD2)};
  const bow=(z,w)=>{c.s('B',0,-.04,z,.07,.56,.06,WD);c.s('B',0,-.24,z,w,.05,.06,WD2);[-1,1].forEach(k=>{c.seg('s',k*w/2,-.24,z,k*(w/2+.06),-.02,z,.026,WD2)});c.seg('s',-(w/2+.06),-.02,z,w/2+.06,-.02,z,.008,0xe8e0c8)};
  if(lv===1){stand();bow(.36,.34);rBolt(c,-.02,.41,.5);return}
  if(lv===2){stand();bow(.36,.44);c.s('B',0,.18,.36,.1,.12,.12,MT);rBolt(c,-.02,.41,.5);rBolt(c,-.02,.47,.5);c.s('B',-.1,-.22,.36,.04,.04,.1,bc);c.s('B',.1,-.22,.36,.04,.04,.1,bc);return}
  if(lv===3){stand();const t=c.sub(0,0,.12);bow(.3,.54);c.s('B',0,.2,.36,.12,.14,.14,DKC);[-.07,0,.07].forEach(x=>rBolt(c,-.02,.41,.5),0);[0,1,2].forEach(i=>rBolt(c,-.02,.41+i*.055,.5));c.s('B',0,.3,.54,.02,.02,.4,WD2);c.s('B',.06,.3,.66,.12,.01,.14,bc);return}
  c.s('C',0,0,.17,.07,.07,.26,WD2);c.s('B',0,0,.1,.4,.08,.04,WD2);c.s('B',0,0,.1,.08,.4,.04,WD2);bow(.38,.62);c.s('B',0,.04,.3,.2,.5,.1,DKC);c.s('B',0,-.04,.52,.08,.5,.04,WD);
  [0,1,2,3,4].forEach(i=>{const k=i-2;rBolt(c,-.02,.44,.5);});[0,1,2,3,4].forEach(i=>rBolt(c,-.02,.4+i*.05,.55));[-1,1].forEach(k=>c.g('S',k*.27,-.22,.44,.03,.03,.03,0xff5a3c));
  c.s('B',0,.32,.58,.02,.02,.5,WD2);c.s('B',.07,.32,.76,.14,.01,.16,bc);c.g('S',0,-.3,.5,.035,.035,.035,0xff7a3c);return [0,.1,.92,.075]};
 // ⛏️ 가시 참호 (맹금 군단): 가시 → 못판 → 지압 발판 → 고행자의 이불
 TD.spikes=(c,lv,b)=>{const bc=b.col||0xb45309;base(c,lv,0x4a3a2a);
  const ring=(n,r,h,col,tilt,off)=>{for(let i=0;i<n;i++){const a=i*PI*2/n+(off||0);c.seg('s',Math.cos(a)*r,Math.sin(a)*r,.09,Math.cos(a)*(r+tilt),Math.sin(a)*(r+tilt),.09+h,.05,col,'F0')}};
  c.s('C',0,0,.085,.33,.33,.03,WD2);
  if(lv===1){ring(7,.22,.3,0xa16a3a,.04);c.seg('s',0,0,.09,0,0,.5,.07,bc,'F0');return}
  if(lv===2){ring(9,.27,.3,0xa16a3a,.05);ring(6,.14,.42,0xc08a4a,.02,.3);c.seg('s',0,0,.09,0,0,.62,.07,bc,'F0');c.s('T.06',0,0,.12,.3,.3,.3,0xd9c7a0);return}
  if(lv===3){ring(11,.29,.34,0x8a5a2b,.08);ring(8,.18,.46,0xc08a4a,.03,.2);ring(5,.09,.58,0xd9d2c0,.01);c.seg('s',0,0,.09,0,0,.72,.08,0xe9e5d8,'F0');c.s('T.06',0,0,.13,.31,.31,.31,0xd9c7a0);c.s('T.06',0,0,.26,.26,.26,.26,0xd9c7a0);return}
  ring(12,.3,.36,0x7a4a26,.09);ring(9,.2,.5,0xc08a4a,.04,.2);ring(6,.1,.62,0xd9d2c0,.02);c.seg('s',0,0,.09,0,0,.8,.09,0xf3f3ee,'F0');
  for(let i=0;i<9;i++){const a=i*PI*2/9+.2;c.g('S',Math.cos(a)*.24,Math.sin(a)*.24,.57,.028,.028,.028,0xff5a3c)}c.g('S',0,0,.86,.05,.05,.05,0xff5a3c);c.s('T.06',0,0,.14,.32,.32,.32,0xd9c7a0);return [0,0,1.0,.07]};
 // 💀 해골 허수아비 (황혼 깃털단): 허수아비 → 파수꾼 → 마법사 → 저승 대왕
 TD.scarecrow=(c,lv,b)=>{const PU=0x4c1d95,BN=0x57534e;base(c,lv,0x3b2f55);
  const skull=(x,y,z,s)=>{c.s('S',x,y,z,.1*s,.1*s,.11*s,0xf5f5f4);c.s('B',x,y-.07*s,z-.09*s,.08*s,.05*s,.04*s,0xe5e7eb);[-1,1].forEach(k=>c.s('S',x+k*.04*s,y-.085*s,z+.01*s,.026*s,.02*s,.03*s,BLK))};
  c.s('C',0,0,.4,.025,.025,.8,BN);c.s('B',0,0,.6,.5,.04,.04,BN);
  if(lv===1){skull(0,0,.88,1);[-1,1].forEach(k=>c.s('B',k*.2,0,.52,.1,.012,.16,0x3b2f55));c.s('B',0,0,.48,.12,.02,.2,0x3b2f55);return}
  if(lv===2){skull(0,0,.88,1.1);c.s('C',0,0,.99,.17,.17,.025,PU);c.s('F0',0,0,1.13,.11,.11,.26,PU);c.s('B',0,0,1.02,.2,.2,.02,GD);[-1,1].forEach(k=>c.s('B',k*.22,0,.5,.1,.012,.22,0x3b2f55));c.s('B',0,0,.46,.14,.02,.26,0x3b2f55);c.w('S',.2,-.05,.3,.05,.05,.07,0xc4b5fd);return}
  if(lv===3){skull(0,0,.9,1.2);c.s('C',0,0,1.02,.19,.19,.025,PU);c.s('F0',0,0,1.18,.12,.12,.3,PU);c.s('B',0,0,1.05,.22,.22,.02,GD);for(let i=0;i<3;i++)c.s('T.1',0,0,.5+i*.07,.09,.09,.09,RBN);
   [-1,1].forEach(k=>{c.s('B',k*.22,0,.5,.12,.012,.26,0x3b2f55)});const r=c.spin(0,0,.7,1.8);[0,1,2].forEach(i=>{const a=i*2.094;r.g('S',Math.cos(a)*.34,Math.sin(a)*.34,0,.05,.05,.05,0xa78bfa)});return}
  c.s('C',0,0,.4,.04,.04,.8,BN);skull(0,0,.95,1.5);c.s('C',0,0,1.1,.22,.22,.03,PU);c.s('F0',0,0,1.3,.14,.14,.36,PU);c.s('B',0,0,1.12,.26,.26,.025,GD);c.g('S',0,-.15,.97,.03,.03,.03,0xc4b5fd);
  c.s('B',0,.04,.5,.62,.04,.7,0x2e1065);for(let i=0;i<4;i++)c.s('T.1',0,0,.46+i*.08,.1,.1,.1,RBN);
  const r=c.spin(0,0,.75,1.8);[0,1,2,3].forEach(i=>{const a=i*PI/2;r.g('S',Math.cos(a)*.4,Math.sin(a)*.4,0,.06,.06,.06,0xa78bfa)});return [0,0,1.55,.075]};
 // 🪦 묘비 둥지 (황혼 깃털단): 묘비 → 이끼 묘비 → 납골당 → 저승 분양 아파트
 TD.tomb=(c,lv,b)=>{base(c,lv,0x3b2f55);const GL2=0x86efac;
  const stone=(x,y,z,s,col)=>{c.s('B',x,y,z+.2*s,.28*s,.07*s,.4*s,col||RSD);c.s('C',x,y,z+.4*s,.14*s,.14*s,.07*s,col||RSD,PI/2);c.s('B',x,y-.04*s,z+.2*s,.03*s,.01*s,.14*s,0xe5e7eb);c.s('B',x,y-.04*s,z+.24*s,.1*s,.01*s,.03*s,0xe5e7eb)};
  if(lv===1){stone(0,0,.1,1);c.s('T.4',0,.02,.58,.12,.12,.08,0x4a2f1a);c.s('S',0,.02,.6,.05,.05,.06,0xf5f5f4);c.w('S',.2,-.1,.3,.05,.05,.07,GL2);return}
  if(lv===2){stone(0,0,.1,1.1,0x5f6672);stone(-.24,-.1,.1,.6);stone(.25,-.08,.1,.55);c.s('T.4',0,.02,.64,.14,.14,.09,0x4a2f1a);c.s('S',-.03,.02,.66,.05,.05,.06,0xf5f5f4);c.s('S',.04,.03,.66,.05,.05,.06,0xfde68a);c.s('S',.1,-.06,.2,.06,.04,.04,0x4d7c0f);c.w('S',-.2,-.1,.35,.05,.05,.08,GL2);c.w('S',.22,-.14,.45,.05,.05,.08,GL2);return}
  if(lv===3){c.s('B',0,0,.3,.5,.4,.4,RSD);c.s('W',0,0,.58,.58,.5,.22,0x4b4358);c.s('B',0,-.201,.26,.2,.01,.3,BLK);c.g('B',0,-.2,.25,.16,.01,.26,0x22c55e);c.s('B',0,-.22,.45,.26,.04,.04,0x4b4358);[-1,1].forEach(k=>c.s('C',k*.24,-.2,.3,.035,.035,.4,0x8b8f99));
   c.s('T.4',0,0,.74,.1,.1,.08,0x4a2f1a);c.s('S',0,0,.76,.05,.05,.06,0xf5f5f4);stone(-.34,-.14,.1,.6);c.w('S',.3,-.25,.3,.06,.06,.1,GL2);c.w('S',-.2,-.28,.5,.05,.05,.08,GL2);return}
  c.s('B',0,0,.34,.58,.46,.5,RSD);c.s('B',0,0,.62,.64,.52,.06,RSN);c.s('W',0,0,.84,.72,.58,.3,0x3d3550);[-1,1].forEach(k=>[-1,1].forEach(j=>c.s('C',k*.27,j*.21,.34,.04,.04,.5,0x8b8f99)));
  c.s('B',0,-.231,.26,.24,.01,.36,BLK);c.g('B',0,-.232,.25,.2,.01,.32,0x22c55e);c.s('B',0,-.25,.5,.3,.05,.04,RSN);c.s('S',0,-.25,.65,.05,.05,.055,0xf5f5f4);
  const r=c.spin(0,0,.5,1.5);[0,1,2,3].forEach(i=>{const a=i*PI/2;r.w('S',Math.cos(a)*.5,Math.sin(a)*.5,i*.05,.06,.06,.1,GL2)});c.g('S',0,0,1.04,.07,.07,.08,0x86efac);return [0,0,1.1,.07]};
 // 🌛 달빛 활 (숲 지킴이): 달빛 활 → 보름달 활 → 은하수 장궁 → 토끼 방아 활
 TD.moonbow=(c,lv,b)=>{const bc=b.col||0xc4b5fd,ML=0xf6f1d6;base(c,lv,0x2f4a3a);
  const arc=(R,z,col,tube,glow)=>c[glow?'g':'s']('A'+tube+',2.6',0,0,z,R,R,R,col,0,PI/2,-PI/2-1.3);
  const str=(R,z)=>c.seg('s',0,-R*.27,z+R*.96,0,-R*.27,z-R*.96,.008,0xfff2c0);
  const arw=(z,len)=>{c.seg('s',0,.05,z,0,-len,z,.014,0xe5e7eb);c.s('F0',0,-len-.04,z,.035,.035,.1,0xfff2c0,PI/2);c.s('B',0,.05,z,.05,.012,.03,bc)};
  c.s('C',0,0,.25,.045,.045,.42,0x5f4a2a);
  if(lv===1){const R=.3,z=.64;arc(R,z,bc,.04);str(R,z);arw(z,.34);return}
  if(lv===2){const R=.38,z=.7;arc(R,z,bc,.045);arc(R,z,0xfff2c0,.015,1);str(R,z);arw(z,.4);c.g('S',0,.0,z+R*1.0+.04,.045,.045,.045,ML);return}
  if(lv===3){const R=.42,z=.74;arc(R,z,bc,.05);arc(R*.8,z,0xe9d5ff,.035);arc(R,z,0xfff2c0,.016,1);str(R,z);arw(z,.46);c.g('S',0,0,z+R+.06,.06,.06,.06,ML);const r=c.spin(0,0,z,1.2);[0,1,2].forEach(i=>{const a=i*2.094;r.g('S',Math.cos(a)*.5,Math.sin(a)*.5,0,.03,.03,.03,0xfff6c2)});return}
  const R=.48,z=.8;arc(R,z,bc,.055);arc(R*.82,z,0xe9d5ff,.04);arc(R,z,0xfff2c0,.018,1);str(R,z);arw(z,.52);arw(z+.06,.52);
  c.g('S',0,.18,z+.05,.16,.16,.16,ML);c.s('S',-.05,.15,z+.08,.04,.04,.04,0xd8d2b0);c.s('S',.06,.17,z-.02,.03,.03,.03,0xd8d2b0);
  const r=c.spin(0,0,z,1.2);[0,1,2,3,4].forEach(i=>{const a=i*PI*2/5;r.g('S',Math.cos(a)*.6,Math.sin(a)*.6,0,.035,.035,.035,0xfff6c2)});return [0,0,z+R+.14,.07]};
 // 🌿 가시 덩굴 (숲 지킴이): 덩굴 → 장미 덩굴 → 정글 덩굴 → 아마존 덩굴 지옥
 TD.thorn=(c,lv,b)=>{const V1=0x15803d,V2=0x166534,V3=0x22a455;base(c,lv,0x2f4a3a);
  const thorns=(n,r,z0,h,off,col)=>{for(let i=0;i<n;i++){const a=i*PI*2/n+(off||0),x=Math.cos(a)*r,y=Math.sin(a)*r;c.seg('s',x,y,z0,x*1.5,y*1.5,z0+h,.035,col||0x3a2a1a,'F0')}};
  const rose=(x,y,z,s,col)=>{c.s('S',x,y,z,.06*s,.06*s,.05*s,col);c.s('S',x,y,z+.02*s,.04*s,.04*s,.04*s,ltn(col,.35));c.s('S',x,y-.03*s,z-.04*s,.05*s,.03*s,.025*s,V1)};
  if(lv===1){c.s('S',0,0,.2,.2,.2,.16,V2);c.s('S',-.12,.05,.14,.14,.14,.12,V1);c.s('S',.12,-.05,.14,.14,.14,.12,V3);thorns(8,.2,.2,.14,.2);c.seg('s',0,0,.3,0,0,.5,.03,V1);c.s('S',0,0,.52,.05,.05,.06,0xf9a8d4);return}
  if(lv===2){c.s('S',0,0,.24,.26,.26,.2,V2);[[-.16,.06],[.16,-.06],[.04,.18]].forEach(([x,y])=>c.s('S',x,y,.17,.15,.15,.13,V1));thorns(10,.24,.24,.18,.2);thorns(6,.14,.38,.2,.5);
   rose(-.14,-.12,.4,1,0xf43f5e);rose(.14,.1,.42,1,0xfb7185);rose(0,-.02,.5,1.2,0xf43f5e);return}
  if(lv===3){c.s('S',0,0,.3,.3,.3,.26,V2);[0,1,2,3,4].forEach(i=>{const a=i*PI*2/5;c.s('S',Math.cos(a)*.2,Math.sin(a)*.2,.2,.14,.14,.12,i%2?V1:V3)});thorns(12,.28,.3,.2,.1);thorns(8,.17,.5,.22,.4);
   [0,1,2].forEach(i=>{const a=i*2.094+.5;c.seg('s',Math.cos(a)*.1,Math.sin(a)*.1,.45,Math.cos(a)*.34,Math.sin(a)*.34,.9,.035,V1);c.s('S',Math.cos(a)*.34,Math.sin(a)*.34,.92,.05,.05,.05,V3);thorns(0,0,0,0)});
   rose(-.18,-.14,.52,1.2,0xf43f5e);rose(.2,.1,.55,1.2,0xfb7185);rose(0,.02,.62,1.4,0xf43f5e);return}
  c.s('S',0,0,.36,.4,.4,.34,V2);[0,1,2,3,4,5].forEach(i=>{const a=i*PI/3;c.s('S',Math.cos(a)*.3,Math.sin(a)*.3,.24,.17,.17,.15,i%2?V1:V3)});thorns(14,.36,.36,.26,.1);thorns(9,.22,.62,.26,.3);
  [0,1,2,3].forEach(i=>{const a=i*PI/2+.4;c.seg('s',Math.cos(a)*.12,Math.sin(a)*.12,.55,Math.cos(a)*.42,Math.sin(a)*.42,1.0,.04,V1);c.s('S',Math.cos(a)*.42,Math.sin(a)*.42,1.02,.06,.06,.06,V3)});
  rose(-.22,-.18,.6,1.4,0xf43f5e);rose(.24,.14,.64,1.4,0xfb7185);rose(0,.0,.76,1.8,0xf43f5e);rose(.1,-.2,.5,1.1,0xfda4af);
  const r=c.spin(0,0,.8,1.1);[0,1,2,3,4,5].forEach(i=>{const a=i*PI/3;r.g('S',Math.cos(a)*.5,Math.sin(a)*.5,Math.sin(i)*.08,.03,.03,.03,0xfde047)});return [0,0,1.12,.07]};
 A.towerMesh=({b,lv})=>{if(!b||typeof GC==='undefined'||typeof THREE==='undefined')return;const f=TD[b.id];if(!f)return;lv=b.id==='wall'?1:Math.max(1,Math.min(4,lv|0||1));
  const key=b.id+'_'+lv;let R=REC[key];
  if(!R){const T=tgt(new THREE.Matrix4(),0),c=cx(T,T.M);const top=f(c,lv,b);if(lv>=4)legend(c,top);R=REC[key]=bake(T)}
  const g=new THREE.Group(),inner=new THREE.Group(),sp=[];inner.name='artTI';inner.scale.setScalar(kq(lv));g.add(inner);g.userData.sp=sp;g.userData.artKey=key;inflate(R,inner,sp);
  if(b.cctv||b.id==='cctv')scanMeshes(g);return g};
 A._towerStat=()=>({rec:Object.keys(REC).length,live:Object.values(REC).filter(r=>r.live).length});

 // ---------- 타워 꾸미기 ----------
 const elemOf=b=>b.tech||(b.combo&&b.combo[0])||null;
 A.tower=({m,b,lv,dex})=>{if(!m||!b||typeof GC==='undefined')return;const k=kq(Math.max(1,Math.min(4,lv||1))),key=m.userData.artKey;
  // 도감 썸네일용으로만 만든 모델은 캐시에서 빼서(지오메트리는 JS가 회수) 전투에 쓰는 것만 남김
  if(key&&REC[key]){if(!dex)REC[key].live=1;else if(!REC[key].live)delete REC[key]}
  if(dex){['scan','scanw'].forEach(n=>{const o=m.getObjectByName(n);if(o)o.visible=false});m.traverse(o=>{if(o.material===MC.twa||o.material===MC.twx)o.material=mat('twD'+(o.material===MC.twx?'x':'a'),()=>basic(0xffffff,{vertexColors:true,transparent:true,opacity:.7,depthWrite:false,side:THREE.DoubleSide}))})}
  // 부드러운 그림자: 반투명 원판 2겹을 지오메트리 1개로 합침(드로우콜 1)
  if(!dex){const s=new THREE.Mesh(gk('shadowM',()=>merge([[new THREE.CircleGeometry(.56,20),0,0,0,1,1,1,0,0,0,0],[new THREE.CircleGeometry(.47,20),0,0,.001,1,1,1,0,0,0,0]])),mat('shadow2',()=>basic(0x000000,{transparent:true,opacity:.22,depthWrite:false})));s.position.set(.05,-.06,.032);s.scale.setScalar(k);s.renderOrder=1;m.add(s)}
  // 속성 타워: 은은한 빛 링(조합 타워는 두 속성 색 2겹) — 타워 종류별 지오메트리 1개 + 공유 재질 1개(맥박은 update에서 재질 하나만 갱신)
  const el=elemOf(b);if(!el)return;const c1=b.combo?b.col:TECH[el].col,c2=b.combo?TECH[b.combo[1]].col:null;
  const g=gk('glow_'+b.id,()=>merge([[new THREE.RingGeometry(.47,.62,32),0,0,0,1,1,1,0,0,0,c1]].concat(c2!=null?[[new THREE.RingGeometry(.63,.69,32),0,0,.001,1,1,1,0,0,0,c2]]:[])));
  const r=new THREE.Mesh(g,dex?mat('glowD',()=>basic(0xffffff,{vertexColors:true,transparent:true,opacity:.5,depthWrite:false})):mat('glowV',()=>basic(0xffffff,{vertexColors:true,transparent:true,opacity:.4,depthWrite:false,blending:THREE.AdditiveBlending})));r.position.z=.036;r.scale.setScalar(k);r.renderOrder=2;m.add(r)};

 // ---------- 이펙트 ----------
 const FIRE=[0xff7a1a,0xffb02e,0xffe066,0xff4d1a];
 function hit(kind,b,x,y,z,col){const n=0;// kind: fire ice thunder wind dark dust egg air
  if(kind==='fire'){const big=b.id==='sun'||b.id==='lava';for(let i=0;i<(big?6:4);i++){const a=rnd()*6.28,v=rr(.8,2);E(PA,0,x,y,z,Math.cos(a)*v,Math.sin(a)*v,rr(.8,2.4),rr(.3,.55),rr(.16,.26),.04,FIRE[i&3],.95,5,1.5,0,0)}
   E(PA,big?1:0,x,y,z+.05,0,0,0,.25,big?.9:.45,big?.3:.2,big?0xfff3b0:0xffa040,.9,0,0,0,0);if(b.id==='lava')E(PN,6,x,y,z,0,0,.6,.7,.3,.7,0x57534e,.55,0,1,0,0)}
  else if(kind==='ice'){for(let i=0;i<4;i++){const a=rnd()*6.28,v=rr(.7,1.6);E(PN,4,x,y,z,Math.cos(a)*v,Math.sin(a)*v,rr(.8,2),rr(.45,.7),rr(.12,.2),.08,i&1?0xe0f7ff:0xa5f3fc,.95,6,.5,0,1)}E(PA,0,x,y,z,0,0,0,.22,.5,.2,0x9be7ff,.8,0,0,0,0)}
  else if(kind==='thunder'){for(let i=0;i<3;i++){const a=rnd()*6.28,v=rr(1.5,3);E(PA,5,x,y,z,Math.cos(a)*v,Math.sin(a)*v,rr(-.5,1.5),rr(.12,.22),rr(.28,.4),.15,i?0xfff59d:0xffffff,1,0,4,0,0)}E(PA,1,x,y,z+.05,0,0,0,.18,.55,.25,0xfde047,1,0,0,0,0)}
  else if(kind==='wind'){const w=rnd()<.5?-9:9;for(let i=0;i<4;i++){const a=i*1.57+rnd(),R=.18;E(PN,6,x+Math.cos(a)*R,y+Math.sin(a)*R,z,-Math.sin(a)*1.7*Math.sign(w),Math.cos(a)*1.7*Math.sign(w),.25,rr(.35,.5),.16,.05,i&1?0xffffff:0xb8fff0,.75,0,1,w,0)}}
  else if(kind==='dark'){for(let i=0;i<3;i++)E(PN,3,x+rr(-.2,.2),y+rr(-.2,.2),z+rr(-.05,.1),rr(-.2,.2),rr(-.2,.2),rr(.5,1),rr(.5,.8),rr(.08,.13),rr(.18,.26),col,.9,-.3,1,0,0)}
  else if(kind==='egg'){for(let i=0;i<3;i++){const a=rnd()*6.28;E(PN,4,x,y,z,Math.cos(a)*1.2,Math.sin(a)*1.2,1.6,.4,.1,.07,i?0xfffbeb:0xfde047,1,7,.5,0,1)}E(PN,6,x,y,z,0,0,.3,.35,.18,.38,0xfef3c7,.7,0,1,0,0)}
  else if(kind==='air'){for(let i=0;i<2;i++){const a=rnd()*6.28;E(PN,2,x,y,z,Math.cos(a)*.6,Math.sin(a)*.6,.4,.55,.16,.14,0xffffff,.95,1.5,1,0,2)}E(PA,0,x,y,z,0,0,0,.2,.45,.2,0x67e8f9,.8,0,0,0,0)}
  else{for(let i=0;i<3;i++){const a=rnd()*6.28;E(PN,6,x,y,z-.1,Math.cos(a)*.7,Math.sin(a)*.7,.25,rr(.35,.5),.12,.3,0xd6b98c,.6,0,2.5,0,0)}}}

 // 🎯 날아가는 탄: 타워마다 픽셀 탄 모양·궤적이 달라요(피해 계산은 그대로, 겉모습만). 맞는 순간 기존 hit 이펙트
 const PJT={},PJ=[],PZL=[],PJS={};
 const PJD={// 모양 그리기(16×16 픽셀)
  egg:(g)=>{dsk(g,8,9,5,6,'#fff7ed');dsk(g,7,8,3,3,'#ffffff');px1(g,10,12,'#fcd34d')},
  feather:(g)=>{for(let i=0;i<12;i++){px1(g,2+i,13-i,'#e0f2fe');px1(g,3+i,13-i,i>8?'#7dd3fc':'#ffffff');if(i%2)px1(g,2+i,12-i,'#bae6fd')}},
  acorn:(g)=>{dsk(g,8,10,5,5,'#a16207');dsk(g,7,9,3,3,'#ca8a04');for(let x=3;x<14;x++)for(let y=4;y<7;y++)px1(g,x,y,'#713f12');px1(g,8,2,'#3f2a12');px1(g,8,3,'#3f2a12')},
  crumb:(g)=>{dsk(g,8,8,4,3,'#d97706');px1(g,7,7,'#fde68a');px1(g,9,8,'#7c2d12')},
  net:(g)=>{for(let i=2;i<15;i+=3){for(let j=2;j<15;j++){px1(g,i,j,'#e7e5e4');px1(g,j,i,'#e7e5e4')}}},
  fire:(g)=>{dsk(g,8,9,5,5,'#ea580c');dsk(g,8,9,3,3,'#f59e0b');dsk(g,8,9,1,1,'#fff7ed');px1(g,8,3,'#f97316');px1(g,6,4,'#fb923c')},
  lava:(g)=>{dsk(g,8,8,6,6,'#7f1d1d');dsk(g,8,8,4,4,'#dc2626');dsk(g,7,7,2,2,'#fbbf24')},
  ice:(g)=>{for(let i=0;i<10;i++){px1(g,3+i,12-i,'#38bdf8');px1(g,4+i,12-i,'#e0f2fe');px1(g,4+i,13-i,'#0ea5e9')}px1(g,13,3,'#ffffff')},
  snow:(g)=>{dsk(g,8,8,5,5,'#bae6fd');dsk(g,7,7,4,4,'#ffffff')},
  leaf:(g)=>{dsk(g,8,8,5,3,'#4ade80');for(let i=4;i<13;i++)px1(g,i,8,'#166534')},
  bubble:(g)=>{for(let a=0;a<6.28;a+=.15)px1(g,8+Math.cos(a)*6,8+Math.sin(a)*6,'#a5f3fc');px1(g,5,5,'#ffffff');px1(g,6,4,'#ffffff')},
  bat:(g)=>{dsk(g,8,9,2,2,'#581c87');for(let i=0;i<6;i++){px1(g,7-i,8-(i%3),'#7e22ce');px1(g,9+i,8-(i%3),'#7e22ce');px1(g,7-i,9,'#3b0764');px1(g,9+i,9,'#3b0764')}px1(g,7,8,'#f472b6');px1(g,9,8,'#f472b6')},
  potion:(g)=>{dsk(g,8,10,5,4,'#4d7c0f');dsk(g,8,10,3,2,'#a3e635');for(let y=2;y<6;y++)px1(g,8,y,'#e7e5e4');px1(g,8,1,'#92400e')},
  acid:(g)=>{dsk(g,8,9,5,5,'#65a30d');dsk(g,7,8,2,2,'#d9f99d');px1(g,8,14,'#84cc16')},
  orb:(g)=>{dsk(g,8,8,5,5,'#ffffff');dsk(g,8,8,3,3,'#ffffff')}};
 function px1(g,x,y,c){g.fillStyle=c;g.fillRect(Math.round(x),Math.round(y),1,1)}
 function dsk(g,cx,cy,rx,ry,c){g.fillStyle=c;for(let y=-ry;y<=ry;y++){const w=Math.round(rx*Math.sqrt(Math.max(0,1-(y/ry)**2)));g.fillRect(cx-w,cy+y,w*2+1,1)}}
 function pjMat(k,tint){const key=k+(tint??'');if(PJS[key])return PJS[key];if(!PJT[k]){const cv=document.createElement('canvas');cv.width=cv.height=16;PJD[k](cv.getContext('2d'));const tx=new THREE.CanvasTexture(cv);tx.magFilter=tx.minFilter=THREE.NearestFilter;tx.generateMipmaps=false;PJT[k]=tx}
  return PJS[key]=new THREE.SpriteMaterial({map:PJT[k],color:tint??0xffffff,transparent:true,depthWrite:false})}
 // 타워 → [모양, 궤적(dart 곧게/lob 포물선/float 둥실/zap 번개/sky 하늘번개/beam 광선), 크기, 색칠(orb·zap용)]
 const PSTY={egg:['egg','lob',.32],air:['feather','dart',.36],acorn:['acorn','lob',.4],snack:['crumb','spray',.22],pylon:[0,'zap',0,0x7dd3fc],net:['net','lob',.5],
  ember:['fire','dart',.34],lava:['lava','lob',.42],sun:[0,'beam',0,0xfde047],ice:['ice','dart',.34],frost:['ice','dart',.34],bliz:['snow','lob',.36],
  static:[0,'zap',0,0xfde047],thunder:[0,'sky',0,0xfef08a],storm:[0,'sky',0,0xa5b4fc],breeze:['leaf','dart',.3],wind:['bubble','float',.38],twister:['leaf','dart',.3],
  bat:['bat','dart',.42],flytrap:[0,'none'],flu:['potion','lob',.36],acid:['acid','lob',.34],steam:['orb','lob',.36,0xe0f2fe],plasma:[0,'beam',0,0xfb923c],firestorm:['fire','dart',.4],pyre:['fire','lob',.38,0x84cc16],
  aurora:[0,'sky',0,0x67e8f9],whiteout:['snow','lob',.4],frostbane:['ice','dart',.36,0xa78bfa],tempest:[0,'sky',0,0xfde047],venomvolt:[0,'zap',0,0x84cc16],miasma:['orb','float',.4,0x86efac]};
 const ZG=new THREE.CylinderGeometry(1,1,1,5),ZM={},UP3=new THREE.Vector3(0,1,0);ZG.userData.cached=1;
 function zmat(c){return ZM[c]||(ZM[c]=new THREE.MeshBasicMaterial({color:c,transparent:true,opacity:.95,depthWrite:false}))}
 // 굵은 번개·광선: 짧은 막대 여러 개를 지그재그로 이어요(1픽셀 선보다 휴대폰에서 잘 보임). 시간이 지나면 가늘어지며 사라짐
 function zline(x0,y0,z0,x1,y1,z1,col,n,amp,life,th){const pts=[];th=th||.05;for(let i=0;i<=n;i++){const t=i/n,j=i&&i<n?amp:0;pts.push(new THREE.Vector3(x0+(x1-x0)*t+(rnd()-.5)*j,y0+(y1-y0)*t+(rnd()-.5)*j,z0+(z1-z0)*t+(rnd()-.5)*j*.6))}
  const g=new THREE.Group();g.renderOrder=35;for(let i=0;i<n;i++){const a=pts[i],b=pts[i+1],d=b.clone().sub(a),L=d.length();if(L<1e-4)continue;const m=new THREE.Mesh(ZG,zmat(col));m.renderOrder=35;m.position.copy(a).addScaledVector(d,.5);m.quaternion.setFromUnitVectors(UP3,d.normalize());m.scale.set(th,L,th);g.add(m)}
  root.add(g);PZL.push({g,t:0,life,th})}
 function fire(tower,b,x,y,tx,ty,z,col,onHit){const st=PSTY[tower]||[ 'orb','dart',.28,b.col??col],sty=st[1];
  if(sty==='none'){onHit();return}
  if(sty==='zap'){zline(x,y,.9,tx,ty,z,st[3],7,.3,.14,.06);zline(x,y,.9,tx,ty,z,0xffffff,7,.12,.09,.025);onHit();return}
  if(sty==='sky'){zline(tx+(rnd()-.5)*.4,ty+.6,4.2,tx,ty,z,st[3],9,.45,.18,.09);zline(tx,ty+.6,4.2,tx,ty,z,0xffffff,9,.15,.12,.035);onHit();return}
  if(sty==='beam'){zline(x,y,1.1,tx,ty,z,st[3],1,0,.2,.11);zline(x,y,1.1,tx,ty,z,0xffffff,1,0,.14,.045);onHit();return}
  const n=sty==='spray'?3:1,d=Math.hypot(tx-x,ty-y),dur=sty==='dart'?Math.max(.08,d/16):sty==='float'?Math.max(.25,d/5):Math.max(.22,d/8),arc=sty==='lob'?.5+d*.12:sty==='spray'?.35:sty==='float'?.15:0;
  for(let i=0;i<n;i++){const sp=new THREE.Sprite(pjMat(st[0],st[3]));sp.scale.set(st[2]*1.7,st[2]*1.7,1);sp.renderOrder=34;root.add(sp);const jx=n>1?(rnd()-.5)*.5:0,jy=n>1?(rnd()-.5)*.5:0;
   PJ.push({sp,x0:x,y0:y,z0:.9,x1:tx+jx,y1:ty+jy,z1:z,t:0,dur:dur*(1+i*.15),arc,spin:sty==='lob'?(rnd()<.5?-8:8):0,rot:Math.atan2(ty-y,tx-x),sty,on:i===0?onHit:null,trail:sty==='dart'?col:null})}}
 function pjUpdate(dt){for(let i=PJ.length-1;i>=0;i--){const p=PJ[i];p.t+=dt/p.dur;if(p.t>=1){root.remove(p.sp);PJ.splice(i,1);if(p.on)p.on();continue}const t=p.t;
   p.sp.position.set(p.x0+(p.x1-p.x0)*t,p.y0+(p.y1-p.y0)*t+(p.sty==='float'?Math.sin(t*12)*.08:0),p.z0+(p.z1-p.z0)*t+p.arc*4*t*(1-t));
   p.sp.material.rotation=p.spin?p.t*p.spin:(p.sty==='dart'?p.rot-Math.PI/4:0);if(p.trail!=null&&rnd()<.5)E(PA,0,p.sp.position.x,p.sp.position.y,p.sp.position.z,0,0,0,.18,.12,.03,p.trail,.7,0,0,0,0)}
  for(let i=PZL.length-1;i>=0;i--){const z=PZL[i];z.t+=dt;const k=Math.max(0,1-z.t/z.life);z.g.children.forEach(m=>{m.scale.x=m.scale.z=z.th*k});if(z.t>=z.life){root.remove(z.g);PZL.splice(i,1)}}}
 A.shoot=({tower,x,y,tx,ty,air,col,b})=>{if(!PA||!b)return;const z=air?1.4:.4;
  const kind=elemOf(b)||(tower==='egg'?'egg':tower==='air'?'air':'dust');const k=kind==='dark'&&tower==='bat'?'dark':kind;
  // 발사구 반짝
  E(PA,0,x,y,.85,0,0,.4,.16,.32,.12,col,.7,0,0,0,0);
  const land=()=>{hit(k,b,tx,ty,z,col);if(b.combo){const k2=b.combo[1];hit(k2,b,tx,ty,z,TECH[k2].col)}if(b.splash&&rnd()<.5)ring(tx,ty,z-.1,.15,b.splash*.9,.35,col,.55)};
  if(PJ.length<90)fire(tower,b,x,y,tx,ty,z,col,land);else land()};
 A.vine=({x,y,tx,ty,life})=>{if(!root)return;zline(x,y,.75,tx,ty,.35,0x4d7c0f,6,.18,life,.075);zline(x,y,.75,tx,ty,.35,0x84cc16,6,.08,life,.035)};
 A.gulp=({u})=>{if(!PA||!u)return;const x=u.x,y=BH-u.y;ring(x,y,.2,.1,1,.35,0x84cc16,.9);for(let i=0;i<10;i++){const a=rnd()*6.28,v=rr(.8,1.8);E(PN,2,x,y,.5,Math.cos(a)*v,Math.sin(a)*v,rr(1.5,2.5),rr(1,1.6),.2,.18,i%2?0xffffff:(u.bp.col||0xffffff),1,2.5,1.2,0,3)}};
 A.die=({u,col,air})=>{if(!PA||!u)return;const x=u.x,y=BH-u.y,z=air?1.4:.3,c=col==null?0xffffff:col;
  for(let i=0;i<9;i++){const a=rnd()*6.28,v=rr(.6,1.5);E(PN,2,x,y,z+.15,Math.cos(a)*v,Math.sin(a)*v,rr(1.2,2.4),rr(1.4,2.2),rr(.18,.28),rr(.15,.24),i%3===2?0xffffff:c,1,2.2,1.2,0,3)}
  for(let i=0;i<4;i++){const a=i*1.57+rnd()*.5;E(PA,1,x,y,z+.2,Math.cos(a)*1.4,Math.sin(a)*1.4,1.2,.6,.24,.08,i&1?0xfff3b0:0xfde047,1,2.5,2,0,0)}
  E(PN,6,x,y,z,0,0,.3,.45,.3,.75,0xffffff,.8,0,1,0,0);E(PA,7,x,y,z+.3,0,0,.9,.9,.12,.26,0xff8fb1,.9,0,1,0,0)};
 A.smoke=({x,y,r,col})=>{if(!PN)return;const n=Math.min(7,3+Math.round(r*2));for(let i=0;i<n;i++){const a=rnd()*6.28,d=Math.sqrt(rnd())*r*.75;E(PN,6,x+Math.cos(a)*d,y+Math.sin(a)*d,.12+rnd()*.15,Math.cos(a)*.12,Math.sin(a)*.12,rr(.06,.16),rr(1.9,2.5),rr(.35,.5),rr(.9,1.3)*Math.max(.7,r*.6),i%3?0x4ade80:i&1?0x86efac:0x365314,.42,0,1,0,0)}
  for(let i=0;i<3;i++){const a=rnd()*6.28;E(PA,0,x+Math.cos(a)*r*.4,y+Math.sin(a)*r*.4,.2,0,0,.35,rr(.8,1.2),.12,.04,0xbef264,.6,0,1,0,0)}
  ring(x,y,.08,.2,r,.6,0x84cc16,.35)};
 A.crit=({u})=>{if(!PA||!u)return;const x=u.x,y=BH-u.y,z=u.bp.t==='A'?1.4:.4;ring(x,y,z,.1,.9,.35,0xfde047,.9);for(let i=0;i<6;i++){const a=i*1.047;E(PA,1,x,y,z+.1,Math.cos(a)*2,Math.sin(a)*2,.6,.3,.22,.05,0xfff3b0,1,0,2,0,0)}E(PA,7,x,y,z+.25,0,0,.6,.5,.15,.4,0xfacc15,.95,0,1,0,0)};
 A.pop=({u})=>{if(!PA||!u)return;const x=u.x,y=BH-u.y,z=1;ring(x,y,z,.1,.8,.3,0xbae6fd,.9);for(let i=0;i<8;i++){const a=i*.785+rnd()*.3;E(PA,0,x,y,z,Math.cos(a)*1.8,Math.sin(a)*1.8,rr(.3,1),rr(.25,.4),.1,.03,i&1?0xffffff:0xbae6fd,.9,1,1.5,0,0)}};
 A.ignite=({u})=>{if(!PA||!u)return;const x=u.x,y=BH-u.y;ring(x,y,.1,.1,1.3,.5,0xf97316,.7);for(let i=0;i<8;i++){const a=rnd()*6.28,v=rr(.8,1.6);E(PA,0,x,y,.3,Math.cos(a)*v,Math.sin(a)*v,rr(.8,1.6),rr(.4,.7),.22,.06,i&1?0xfb923c:0xfde047,.9,1.5,1.5,0,0)}};
 A.leak=({u})=>{if(!PA||!u)return;const x=u.x,y=BH-u.y;
  ring(x,y,.1,.1,1.4,.5,0xff3b3b,.9);ring(x,y,.12,.1,2.4,.7,0xff8a8a,.5,.08);
  for(let i=0;i<12;i++){const a=rnd()*6.28,v=rr(1.5,3);E(PA,i&1?5:0,x,y,.3,Math.cos(a)*v,Math.sin(a)*v,rr(1,3),rr(.3,.55),rr(.22,.4),.06,i&1?0xffb4b4:0xff3b3b,1,6,2,0,1)}
  E(PA,1,x,y,.4,0,0,0,.3,1.1,.4,0xff6b6b,.9,0,0,0,0);flash(0xff2020,.7,.6)};
 A.revive=({u})=>{if(!PA||!u)return;const x=u.x,y=BH-u.y;pillar(x,y,0xff8a2b);ring(x,y,.08,.2,1.6,.7,0xffb02e,.9);ring(x,y,.1,.2,1.1,.5,0xfff3b0,.7,.12);
  emitter(.7,60,()=>{const a=rnd()*6.28,R=rr(0,.3);E(PA,rnd()<.25?1:0,x+Math.cos(a)*R,y+Math.sin(a)*R,rr(.1,.5),Math.cos(a)*.3,Math.sin(a)*.3,rr(2.5,4.5),rr(.5,.9),rr(.25,.4),.05,FIRE[(rnd()*4)|0],.95,-.5,.8,0,0)});
  for(let i=0;i<6;i++){const a=i*1.05;E(PN,2,x,y,1,Math.cos(a)*1.2,Math.sin(a)*1.2,1.5,1.4,.26,.22,i&1?0xffe066:0xff7a1a,1,2,1.2,0,3)}};
 // 조합 스킬: 모드 + 모양 + 색
 const SK={steam:['rise',[6,6,0],[0xffffff,0xfda4af,0xbae6fd]],plasma:['burst',[5,0,1],[0xfb923c,0xfde047,0xffffff]],firestorm:['spiral',[0,0,1],[0xff7a1a,0xf43f5e,0xffd166]],pyre:['rise',[0,3,0],[0xa3e635,0xff7a1a,0x84cc16]],
  aurora:['rain',[4,1,1],[0x93c5fd,0xc4b5fd,0x67e8f9]],whiteout:['side',[4,6,4],[0xffffff,0xccfbf1,0xe0f2fe]],frostbane:['rain',[4,3,4],[0x5eead4,0xa5f3fc,0x84cc16]],tempest:['spiral',[5,6,5],[0xa5b4fc,0xfde047,0xffffff]],
  venomvolt:['burst',[5,3,3],[0xbef264,0xfde047,0x84cc16]],miasma:['side',[6,3,6],[0x86efac,0x4ade80,0xd9f99d]]};
 const ADD=new Set([0,1,5]);
 A.skill=({id,col1,col2})=>{if(!PA)return;const st=SK[id]||['rain',[1,0,4],[col1,col2,0xffffff]],W=COLS+.5,cx=W/2,cy=BH/2,mode=st[0],shp=st[1],cols=st[2];
  flash(col1,.7,1.2);ring(cx,cy,.5,.4,7.5,1,col1,.85);ring(cx,cy,.55,.4,6,1,col2,.75,.18);ring(cx,cy,.6,.3,4,.8,0xffffff,.6,.36);
  E(PA,1,cx,cy,1,0,0,0,.55,1.8,.6,0xffffff,.8,0,0,0,0);
  emitter(1.4,110,()=>{const sh=shp[(rnd()*3)|0],S2=ADD.has(sh)?PA:PN,c=cols[(rnd()*3)|0],big=sh===6?rr(.6,1.1):rr(.28,.48);
   if(mode==='rain')E(S2,sh,rr(-.5,W+.5),rr(-.5,BH+.5),rr(3,6),rr(-.3,.3),rr(-.3,.3),rr(-5,-3),rr(1,1.5),big,big*.7,c,.95,0,0,0,1);
   else if(mode==='rise')E(S2,sh,rr(0,W),rr(0,BH),.1,rr(-.2,.2),rr(-.2,.2),rr(1.5,3),rr(1,1.6),big*.6,big*1.6,c,.85,-.3,.5,0,0);
   else if(mode==='side')E(S2,sh,rr(-2,0),rr(-.5,BH+.5),rr(.3,2.5),rr(5,8),rr(-1.5,-.5),rr(-.3,.3),rr(1,1.6),big,big*1.2,c,.85,0,0,0,0);
   else if(mode==='spiral'){const a=rnd()*6.28,R=rr(.5,5);E(S2,sh,cx+Math.cos(a)*R,cy+Math.sin(a)*R,rr(.3,2),-Math.sin(a)*4,Math.cos(a)*4,rr(.5,1.5),rr(.8,1.3),big,big*.5,c,.95,0,.3,2.6,0)}
   else{const a=rnd()*6.28,v=rr(3,8);E(S2,sh,cx,cy,1,Math.cos(a)*v,Math.sin(a)*v,rr(0,2),rr(.6,1.1),big,big*.4,c,1,1.5,1,0,0)}})};

 // 수상한 알 연구소: 부화 / 산란 / 마일스톤 해금
 A.hatch=({u})=>{if(!PA||!u)return;const x=u.x,y=BH-u.y,z=.3,gold=!!u.gold,dino=u.bp&&u.bp.id==='hatch_dino',k=dino?1.6:1;
  for(let i=0;i<(dino?12:8);i++){const a=rnd()*6.28,v=rr(1,2.2)*k;E(PN,4,x,y,z+.1,Math.cos(a)*v,Math.sin(a)*v,rr(1.5,2.6),rr(.6,.9),rr(.12,.2)*k,.1,gold?(i&1?0xfacc15:0xfff3b0):(i%3?0xfffbeb:0xf5e6c8),1,7,.6,0,1)}
  E(PN,6,x,y,z,0,0,.4,.5,.25*k,.8*k,0xffffff,.85,0,1,0,0);
  for(let i=0;i<(gold?8:4);i++){const a=i*6.28/(gold?8:4)+rnd()*.4,v=gold?1.8:1.3;E(PA,1,x,y,z+.25,Math.cos(a)*v*k,Math.sin(a)*v*k,1,.7,.26*k,.08,gold?0xffd700:(i&1?0xfff3b0:0xfde047),1,2,2,0,0)}
  if(gold){ring(x,y,.1,.1,1.3,.6,0xffd700,.9);E(PA,0,x,y,z+.2,0,0,0,.5,1.1,.3,0xffe680,.9,0,0,0,0);emitter(.6,30,()=>E(PA,1,x+rr(-.5,.5),y+rr(-.5,.5),rr(.3,1.1),0,0,.4,.6,rr(.12,.2),.03,0xffe066,1,0,0,0,0))}
  if(dino)ring(x,y,.1,.15,1.6,.5,0xa3e635,.7)};
 A.lay=({u})=>{if(!PN||!u)return;const x=u.x,y=BH-u.y;for(let i=0;i<2;i++){const a=rnd()*6.28;E(PN,6,x+Math.cos(a)*.12,y+.1+Math.sin(a)*.1,.08,Math.cos(a)*.35,Math.sin(a)*.35,.25,.45,.14,.3,0xe7d8b8,.55,0,2,0,0)}};
 A.unlock=({k})=>{if(!PA)return;const W=COLS+.5,cx=W/2,cy=BH/2,CF=[0xff6b9a,0xffd166,0x7dd3fc,0x86efac,0xc4b5fd,0xfb923c,0xffffff];
  flash(0xffd166,.35,.9);ring(cx,cy,.6,.3,6.5,1,0xffd166,.8);ring(cx,cy,.65,.3,5,1,0xff6b9a,.6,.25);E(PA,1,cx,cy,1.2,0,0,0,.7,1.5,.6,0xfff3b0,.85,0,0,0,0);
  emitter(2,90,()=>{const r=rnd(),sh=r<.35?2:r<.8?4:r<.92?7:1,S2=sh===1?PA:PN,c=CF[(rnd()*CF.length)|0];
   E(S2,sh,rr(-.6,W+.6),rr(-.6,BH+.6),rr(4,7),rr(-.4,.4),rr(-.4,.4),rr(-2.5,-1.2),rr(1.8,2.6),sh===2?rr(.26,.36):rr(.16,.26),sh===2?.26:.2,c,1,.4,.1,0,5)})};

 // 타워 진화(강화): 빛 기둥 + 링 + 파편, Lv.4는 금빛 폭발
 A.evolve=({x,y,lv,b})=>{if(!PA||x==null)return;const L=lv||2,gold=L>=4,c=gold?0xffd54a:(b&&b.col!=null?b.col:0xffffff),c2=gold?0xfff3b0:ltn(c,.5);
  pillar(x,y,gold?0xffc93c:c);ring(x,y,.06,.15,gold?1.9:1.1+L*.1,.55,c,.95);ring(x,y,.08,.1,gold?1.3:.8,.45,0xffffff,.75,.12);
  for(let i=0;i<10+L*2;i++){const a=rnd()*6.28,v=rr(1,2.2);E(PN,4,x,y,.5,Math.cos(a)*v,Math.sin(a)*v,rr(1.6,3),rr(.6,.95),rr(.12,.2),.08,i%3?c:0xffffff,1,6,.6,0,1)}
  for(let i=0;i<6;i++){const a=i*1.047+rnd()*.3;E(PA,1,x,y,.6,Math.cos(a)*1.3,Math.sin(a)*1.3,1.4,.7,.24,.06,i&1?c2:c,1,2,1.6,0,0)}
  E(PA,0,x,y,.6,0,0,.2,.35,1,.3,c2,.95,0,0,0,0);
  emitter(.55,45,()=>{const a=rnd()*6.28,R=rr(0,.28);E(PA,rnd()<.4?1:0,x+Math.cos(a)*R,y+Math.sin(a)*R,rr(.1,.4),0,0,rr(2,3.6),rr(.45,.7),rr(.12,.22),.03,rnd()<.5?c:c2,.95,0,.6,0,0)});
  if(gold){flash(0xffc93c,.28,.7);ring(x,y,.1,.2,2.6,.8,0xffe680,.8,.2);E(PA,1,x,y,1.2,0,0,0,.6,1.6,.5,0xfff3b0,1,0,0,0,0);
   for(let i=0;i<22;i++){const a=rnd()*6.28,v=rr(2,4);E(PA,i%3?1:5,x,y,.9,Math.cos(a)*v,Math.sin(a)*v,rr(1,4),rr(.6,1),rr(.18,.32),.06,i&1?0xffd700:0xfff3b0,1,3,1.4,0,0)}
   emitter(1,40,()=>E(PA,1,x+rr(-.7,.7),y+rr(-.7,.7),rr(1.2,2.4),0,0,-.4,rr(.6,1),rr(.12,.22),.03,rnd()<.5?0xffd700:0xffffff,1,.4,.2,0,0))}};
 A.update=({dt,view:v,t})=>{if(!root)return;clock+=dt;U.t.value=clock;if(typeof S!=='undefined'&&S&&S.pl&&S.pl[v])hex3Theme(((v+(S.off||0))%8)%5);
  if(v!==lastView||t<lastT-1){clearAll();lastView=v}lastT=t;pjUpdate(dt);
  if(XK!==lastXK){lastXK=XK;layDecor()}
  PU.uS.value=2.2*ren.domElement.height/(2*Math.tan(cam.fov*Math.PI/360));// 2.2: 아틀라스 칸 여백 보정
  // 입구·출구 맥박
  const pu=.5+.5*Math.sin(clock*3),pd=.5+.5*Math.sin(clock*4.2+1);
  if(GATE.inS){GATE.inS.material.opacity=.14+.12*pu;GATE.outS.material.opacity=.16+.16*pd;GATE.inC.material.opacity=.35+.35*pu;GATE.outC.material.opacity=.35+.45*pd;
   GATE.inT.forEach(o=>o.material.emissiveIntensity=.25+.25*pu);GATE.outT.forEach(o=>o.material.emissiveIntensity=.2+.35*pd)}
  // 속성 타워 빛 링 맥박(공유 재질이라 재질 수만큼만 갱신)
  if(MC.glowV)MC.glowV.opacity=.3+.2*Math.sin(clock*2.6);if(MC.twx)MC.twx.opacity=.32+.22*Math.sin(clock*3.2);// 전설 오라 맥박
  stepEm(dt);stepSys(PA,dt);stepSys(PN,dt);stepPools(dt)};
 A._stat=()=>({pa:PA&&PA.live,pn:PN&&PN.live,em:EM.length});
 return A})();

$('cv').addEventListener('pointerdown',e=>{if(!S||over||!Cam)return;const r=$('cv').getBoundingClientRect();
 ray.setFromCamera({x:(e.clientX-r.left)/r.width*2-1,y:-((e.clientY-r.top)/r.height)*2+1},Cam);
 const p=new THREE.Vector3();if(!ray.ray.intersectPlane(pln,p))return;
 const c=nearCell(p.x/XK,BH-p.y);if(c.d<.62)cell(c.x,c.y)});
function useSkill0(){const me=S.pl[0],s=skillOf(me);if(S.cdn>0||!me.alive)return;if(!s)return toast('✨ 속성 2개를 고르면 조합 스킬을 해금할 수 있어요');
 if(netG()){if(me.skU&&me.skCD>0)return toast(`재사용까지 ${Math.ceil(me.skCD)}초`);return NET.cmd({a:'skill'})}actSkill(0);ui()}
function actSkill(pid){const me=S.pl[pid],s=me&&skillOf(me);if(!s||S.cdn>0||!me.alive)return;
 if(!me.skU){if(me.gold<SKC)return say(pid,`해금에 ${SKC}G가 필요해요`);me.gold-=SKC;me.skU=1;if(pid===0&&!S.sim&&!S.net)try{newsBird(`🎉 특종! 조합 스킬 '${s.n}' 해금!`)}catch(e){}return say(pid,`${s.c.ic} ${s.n} 해금! ${s.d} (재사용 ${s.cd}초)`)}
 if(me.skCD>0)return say(pid,`재사용까지 ${Math.ceil(me.skCD)}초`);useSkill(me)}
$('skb').onclick=useSkill0;
$('lanet').onclick=e=>{e.stopPropagation();const ids=Object.keys(laneTargets()).map(Number);if(!ids.length)return;const cur=+$('lane').dataset.id,i=ids.indexOf(cur);lanePick=ids[(i+1)%ids.length];laneT=1;lanePanel(0)};
$('lanec').onclick=()=>{const v=+$('lane').dataset.id;if(!isNaN(v)&&S.pl[v].alive){view=v;sel=null;insp=null;ui()}};
addEventListener('resize',()=>setTimeout(laneFit,50));
document.addEventListener('pointerdown',e=>{if(e.target.closest&&e.target.closest('button'))sfx('tap')},true);
$('snd').onclick=()=>{if(typeof SFX!=='undefined'&&SFX.toggle)$('snd').textContent=SFX.toggle()?'🔇':'🔊'};
try{if(typeof SFX!=='undefined'&&SFX.muted)$('snd').textContent='🔇'}catch(e){}
function pickTech(k){const me=S.pl[0];if(!me.alive||has(me,k)||me.tech2)return;const cost=me.tech?TECH2C:0,cb=me.tech?comboOf(me.tech,k):null;
 if(techPend!==k){techPend=k;ui();return toast(`${TECH[k].ic} ${TECH[k].n}: ${TECH[k].d}${cost?' · '+cost+'G':''}${cb?` · 조합 ${TB[cb.t].n}·${UB[cb.u].n} 해금`:''} · 한 번 더 누르면 확정`)}
 if(me.gold<cost){techPend=null;ui();return toast('골드가 부족해요')}
 techPend=null;if(netG()){NET.cmd({a:'tech',k});sfx('tech',{k,combo:!!cb});if(!me.tech)me.tech=k;else me.tech2=k;ui();return}
 actTech(0,k);ui()}
function actTech(pid,k){const me=S.pl[pid];if(!me||!me.alive||!TECH[k]||has(me,k)||me.tech2)return;const cost=me.tech?TECH2C:0,cb=me.tech?comboOf(me.tech,k):null;if(me.gold<cost)return say(pid,'골드가 부족해요');
 me.gold-=cost;if(!me.tech)me.tech=k;else me.tech2=k;if(pid===0)sfx('tech',{k,combo:!!cb});
 say(pid,cb?`✨ ${cb.ic} ${cb.n} 조합! ${TB[cb.t].ic}${TB[cb.t].n} · ${UB[cb.u].ic}${UB[cb.u].n} 해금`:`${TECH[k].ic} ${TECH[k].n} 확정! 전용 새 ${UB[TECH[k].u].ic}${UB[TECH[k].u].n} 해금 · 두 번째 속성은 ${TECH2C}G`)}
TK.forEach(k=>{const t=TECH[k],e=document.createElement('button');e.className='tch';e.innerHTML=`<i>${t.ic}</i><span>${t.n}</span><s>${t.d}</s><u>무료</u>`;e.onclick=()=>pickTech(k);$('shB').append(e);t.el=e});
U.filter(u=>u.hidden).forEach(u=>{if(u.el&&u.el.style)u.el.style.display='none'});
U.forEach(u=>{const s=u.el.children&&u.el.children[1];if(s&&s.textContent!==undefined)s.textContent=(u.race?RACE[u.race].ic:u.tech?TECH[u.tech].ic:u.combo?u.combo.map(k=>TECH[k].ic).join(''):'')+(u.sn||u.n)+(u.x&&!u.tech&&!u.combo?'★':'')});
// ---------- 📖 카드 도감 (3페이지) ----------
const DXC={};let dxPage='u',dxPrev=null;
// 🖼️ 상점 초상화: 한 프레임에 하나씩 3D 초상화를 그려 버튼 아이콘을 바꿔요(휴대폰이 멈추지 않게)
const SHQ=[];let SHR=null,SHQd=0;
function thumbOne(key){if(!SHR){const r=new THREE.WebGLRenderer({antialias:true,alpha:true,preserveDrawingBuffer:true});r.setPixelRatio(1);r.setSize(128,128);const sc=new THREE.Scene();
  sc.add(new THREE.AmbientLight(0xffffff,.6));sc.add(new THREE.HemisphereLight(0xe0f2ff,0x6b5a3a,.6));const dl=new THREE.DirectionalLight(0xffffff,1);dl.position.set(3,-4,7);sc.add(dl);const cam=new THREE.PerspectiveCamera(30,1,.05,60);cam.up.set(0,0,1);SHR={r,sc,cam}}
 const isU=key[0]==='u',b=isU?UB[key.slice(2)]:TB[key.slice(2)];if(!b)return;let m;
 if(isU){m=birdMesh3(b,0x60a5fa);artFx('bird',{m,b,dex:true})}else{m=artFx('towerMesh',{b,lv:1})||towerMesh3(b);artFx('tower',{m,b,lv:1,dex:true})}
 m.traverse(o=>{if(o.geometry&&o.geometry.type==='PlaneGeometry')o.visible=false});SHR.sc.add(m);m.updateMatrixWorld(true);const bx=new THREE.Box3();
 m.traverse(o=>{if(o.isMesh&&o.visible){if(!o.geometry.boundingBox)o.geometry.computeBoundingBox();bx.union(o.geometry.boundingBox.clone().applyMatrix4(o.matrixWorld))}});
 const c=bx.getCenter(new THREE.Vector3()),sz=bx.getSize(new THREE.Vector3()),d=Math.max(sz.x,sz.y,sz.z*1.2)*2.2+.2;SHR.cam.position.set(c.x+d*.3,c.y-d*.82,c.z+d*.5);SHR.cam.lookAt(c);
 SHR.r.render(SHR.sc,SHR.cam);DXC['s_'+key]=SHR.r.domElement.toDataURL();SHR.sc.remove(m);m.traverse(o=>{if(o.material)o.material.dispose()})}
function shopThumbTick(){shopThumbTick.f=(shopThumbTick.f||0)+1;if(shopThumbTick.f%2)return;// 두 프레임에 하나씩만 그려 게임이 버벅이지 않게
 if(!SHQd){SHQd=1;T.forEach(t=>SHQ.push('t_'+t.id));U.forEach(u=>{if(!u.hidden)SHQ.push('u_'+u.id)})}if(!SHQ.length)return;const key=SHQ.shift();
 try{if(!DXC['s_'+key])thumbOne(key)}catch(e){return}const x=key[0]==='u'?UB[key.slice(2)]:TB[key.slice(2)];if(x&&x.el&&DXC['s_'+key]){const i=x.el.querySelector('i');if(i){i.innerHTML=`<img src="${DXC['s_'+key]}" alt="">`;x.el.classList.add('pic')}}}
// 💥 피해 숫자(내가 보는 진영만, 너무 많으면 건너뜀) + 큰 새 격추 배너
const DMGP={pool:[],i:0,t:0};
// 피해 숫자: 치명타이거나 큰 피해(최대 체력 12% 이상, 최소 60)만. 휴대폰이 느려 화질을 두 번 낮췄으면 끔
function dmgPop(u,v,crit){if(!S||S.sim||!R||!Cam||v<1||pfS>=2)return;if(!crit&&v<Math.max(60,u.bp.hp*.12))return;
 const now=performance.now();if(now-DMGP.t<90&&!crit)return;DMGP.t=now;
 if(!DMGP.pool.length){const L=document.createElement('div');L.id='dmgl';$('cv').parentNode.appendChild(L);for(let i=0;i<28;i++){const d=document.createElement('b');L.appendChild(d);DMGP.pool.push(d)}}
 const z=u.bp.t==='A'&&!(u.gr>0)?1.7:1,v3=new THREE.Vector3(u.x,BH-u.y,z).applyMatrix4(Sc.matrixWorld).project(Cam);if(v3.z>1)return;const el=R.domElement,w=el.clientWidth,h=el.clientHeight;
 const d=DMGP.pool[DMGP.i++%DMGP.pool.length];d.style.left=((v3.x*.5+.5)*w+(Math.random()-.5)*16)+'px';d.style.top=((-v3.y*.5+.5)*h)+'px';d.textContent=Math.round(v);d.className=crit?'c':'';void d.offsetWidth;d.className=(crit?'c ':'')+'go'}
/* 새 위에 짧은 글자(MISS!·멸종 거부! 등) */function popTxt(u,txt){if(!S||S.sim||!R||!Cam||pfS>=2)return;if(!DMGP.pool.length){const L=document.createElement('div');L.id='dmgl';$('cv').parentNode.appendChild(L);for(let i=0;i<28;i++){const d=document.createElement('b');L.appendChild(d);DMGP.pool.push(d)}}
 const z=u.bp.t==='A'&&!(u.gr>0)?1.9:1.2,v3=new THREE.Vector3(u.x,BH-u.y,z).applyMatrix4(Sc.matrixWorld).project(Cam);if(v3.z>1)return;const el=R.domElement,w=el.clientWidth,h=el.clientHeight;
 const d=DMGP.pool[DMGP.i++%DMGP.pool.length];d.style.left=((v3.x*.5+.5)*w)+'px';d.style.top=((-v3.y*.5+.5)*h)+'px';d.textContent=txt;d.className='t';void d.offsetWidth;d.className='t go'}
const EMOX={};function emoTexC(t){if(EMOX[t])return EMOX[t];const cv=document.createElement('canvas');cv.width=cv.height=96;const x=cv.getContext('2d');x.font='76px sans-serif';x.textAlign='center';x.textBaseline='middle';x.fillText(t,48,54);return EMOX[t]=new THREE.CanvasTexture(cv)}
function killBanner(b){if(!S||S.sim)return;const now=performance.now();if(now-(killBanner.t||0)<3000)return;killBanner.t=now;let e=$('killb');if(!e){e=document.createElement('div');e.id='killb';$('cv').parentNode.appendChild(e)}e.innerHTML=`<i>💥</i><b>격추!</b><small>${b.ic} ${b.n}</small>`;e.className='';void e.offsetWidth;e.className='go'}
const STARX={};function starTex(lv){if(STARX[lv])return STARX[lv];const c=document.createElement('canvas');c.width=c.height=128;const x=c.getContext('2d');x.beginPath();
 for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5,r=i%2?26:58;x.lineTo(64+Math.cos(a)*r,68+Math.sin(a)*r)}x.closePath();x.fillStyle=lv>=4?'#ffd23f':'#fde047';x.lineWidth=10;x.strokeStyle='#111';x.stroke();x.fill();
 x.font='900 46px "Black Han Sans", sans-serif';x.textAlign='center';x.textBaseline='middle';x.lineWidth=9;x.strokeStyle='#111';x.strokeText(lv,64,74);x.fillStyle='#fff';x.fillText(lv,64,74);return STARX[lv]=new THREE.CanvasTexture(c)}
function dxThumbs(){if(DXC.done)return;const r=new THREE.WebGLRenderer({antialias:true,alpha:true,preserveDrawingBuffer:true});r.setPixelRatio(2);r.setSize(200,200);
 const sc=new THREE.Scene();sc.add(new THREE.AmbientLight(0xffffff,.55));sc.add(new THREE.HemisphereLight(0xe0f2ff,0x6b5a3a,.6));const dl=new THREE.DirectionalLight(0xffffff,1);dl.position.set(3,-4,7);sc.add(dl);
 const cam=new THREE.PerspectiveCamera(30,1,.05,60);cam.up.set(0,0,1);
 const shotRaw=(m,key)=>shot(m,key,1);const shot=(m,key,raw)=>{if(!raw)artFx(key[0]==='u'?'bird':'tower',{m,b:key[0]==='u'?UB[key.slice(2)]:TB[key.slice(2)],dex:true});m.traverse(o=>{if(o.geometry&&o.geometry.type==='PlaneGeometry')o.visible=false});sc.add(m);m.updateMatrixWorld(true);
  const bx=new THREE.Box3();m.traverse(o=>{if(o.isMesh&&o.visible){if(!o.geometry.boundingBox)o.geometry.computeBoundingBox();bx.union(o.geometry.boundingBox.clone().applyMatrix4(o.matrixWorld))}});
  const c=bx.getCenter(new THREE.Vector3()),s=bx.getSize(new THREE.Vector3()),d=Math.max(s.x,s.y,s.z*1.2)*2.4+.25;
  cam.position.set(c.x+d*.3,c.y-d*.82,c.z+d*.5);cam.lookAt(c);r.render(sc,cam);DXC[key]=r.domElement.toDataURL();sc.remove(m);m.traverse(o=>{if(o.material)o.material.dispose()})};
 try{U.forEach(u=>{if((u.count||1)>1){const g=new THREE.Group(),n=Math.min(3,u.count),P=[[0,-.08,0],[-.45,.22,0],[.45,.22,0]];for(let i=0;i<n;i++){const m=birdMesh3(u,0x60a5fa);artFx('bird',{m,b:u,dex:true});m.position.set(...P[i]);if(i){m.scale.multiplyScalar(.88);m.rotation.z=i===1?.35:-.35}g.add(m)}shotRaw(g,'u_'+u.id)}else shot(birdMesh3(u,0x60a5fa),'u_'+u.id)});T.forEach(t=>{for(let lv=1;lv<=(t.id==='wall'?1:4);lv++){const m=artFx('towerMesh',{b:t,lv})||towerMesh3(t);artFx('tower',{m,b:t,lv,dex:true});shotRaw(m,lv===1?'t_'+t.id:'t_'+t.id+'_'+lv)}})}catch(e){console.log(e)}
 r.dispose();if(r.forceContextLoss)r.forceContextLoss();DXC.done=1}
const dxQ=f=>/^["“]/.test(f||'')?f:'“'+f+'”';const tier=c=>c>=1000?'lg':c>=500?'ep':c>=250?'rr':'cm',TIERN={cm:'일반',rr:'희귀',ep:'영웅',lg:'전설'};
const dxBadge=x=>x.race?`<em>${RACE[x.race].ic} ${RACE[x.race].n} 전용</em>`:x.tech?`<em>${TECH[x.tech].ic} ${TECH[x.tech].n} 전용</em>`:x.combo?`<em>${x.combo.map(k=>TECH[k].ic).join('')} 조합</em>`:'';
const DXTH={humbee:'meadow',pelican:'sky',crocbird:'water',penguin:'ice',frostpeng:'ice',blizgull:'ice',auroraowl:'aurora',dodo:'stage',phoenix:'fire',plasmabird:'fire',comet:'sky',swan:'water',duck:'water',seagull:'water',pirate:'ice',albatross:'sky',peacock:'stage',parrot:'stage',rooster:'stage',owl:'night',crow:'night',ghostcrow:'night',vampire:'night',plague:'night',voltbat:'storm',thunderbird:'storm',stormeagle:'storm',crane:'spa',falcon:'sky',eagle:'sky'};
const dxTh=u=>DXTH[u.id]||(u.hidden||u.id==='egg_legs'?'lab':u.tech==='fire'?'fire':u.tech==='ice'?'ice':u.tech==='thunder'?'storm':u.tech==='wind'?'sky':u.tech==='dark'?'night':u.race?'stage':u.t==='A'?'sky':'meadow');
const dxImg=k=>DXC[k]?`<img src="${DXC[k]}" alt="">`:'<i class="noimg">🐦</i>';
function cardU(u){const k=tier(u.c);return `<div class="cd ${k}"><div class="ci" data-th="${dxTh(u)}">${dxImg('u_'+u.id)}<span class="tr ${k}">${TIERN[k]}</span>${dxBadge(u)}</div><div class="cn">${u.ic} ${u.n}</div><div class="cf">${dxQ(u.fl)}</div>
 <div class="cs"><span>💰${u.c}G</span><span>❤️${u.hp}</span><span>${u.t==='A'?'🪶공중':'🦶지상'}</span><span>💨${u.sp}</span><span>📈인컴+${u.inc}</span><span>💥피해${u.dm}</span></div>${u.x?`<div class="cx">✨ ${u.x}</div>`:''}</div>`}
function cardT(t){const k=t.combo?'lg':t.race?'ep':t.tech?(t.c>=380?'ep':'rr'):'cm',tg=t.t==='A'?'공중만':t.t==='G'?'지상만':'공중+지상';
 return `<div class="cd ${k}"><div class="ci">${dxImg('t_'+t.id)}<span class="tr ${k}">${TIERN[k]}</span>${dxBadge(t)}</div><div class="cn">${t.ic} ${t.n}</div><div class="cf">${dxQ(t.fl)}</div>
 <div class="cs"><span>💰${t.c}G</span>${t.d?`<span>⚔️${t.d}</span><span>🎯${t.r}</span><span>⏱${(1/t.cd).toFixed(1)}회/초</span><span>${tg}</span>`:t.cctv?`<span>👁 감지 ${t.r}칸</span><span>🔒 은신 목격 or 4분</span><span>최대 2개</span>`:t.snack?`<span>🍤 과자 ${t.snack}개/${t.cd}초</span><span>🎯${t.r}</span><span>공중 새 유인</span>`:'<span>🧱 길막 전용</span>'}</div>${t.x?`<div class="cx">✨ ${t.x}</div>`:''}${t.id==='wall'?'':`<div class="evo">${t.lvn.slice(1).map((n,i)=>`<div><i>${dxImg('t_'+t.id+'_'+(i+2))}</i><b>${'🥚'.repeat(i+2)}</b><small>${n}</small></div>`).join('')}</div>`}</div>`}
function cardC(c){const t=TB[c.t],u=UB[c.u],s=SKILL[c.t];
 return `<div class="cd wide lg"><div class="cn cbig">${c.ic} ${c.n} 조합</div><div class="cf">“${CFL[c.t]}”</div>
 <div class="cc"><div>${dxImg('t_'+t.id)}<b>${t.ic} ${t.n}</b><small>${t.x} · ${t.c}G</small></div><div>${dxImg('u_'+u.id)}<b>${u.ic} ${u.n}</b><small>${u.x} · ${u.c}G</small></div></div>
 <div class="sk">🌟 <b>${s.n}</b><br>${s.d}<br><small>재사용 ${s.cd}초 · 해금 ${SKC}G</small></div></div>`}
function dxRender(){[...$('dext').children].forEach(b=>b.className=b.dataset.p===dxPage?'on':'');const H=(t,s)=>`<h3>${t}${s?` <small>${s}</small>`:''}</h3>`;let h='';
 if(dxPage==='u'){const nx=eggNext();h+=H('🥚 수상한 알 연구소',S?`이번 판에 보낸 알 ${EGG.n}개`+(nx?` · 다음 해금까지 ${nx.n-EGG.n}개`:' · 완전 해금!'):'한 판 안에서 알을 많이 보낼수록 해금돼요');
  h+=`<div class="cd wide ${nx?'rr':'lg'}"><div class="cn">🥚 수상한 알 ${EGG.n}개</div><div class="pbar"><i style="width:${Math.min(100,EGG.n/1.5)}%"></i>${EGGM.map(m=>`<b style="left:${Math.min(m.n/1.5,95)}%">${m.ic}</b>`).join('')}</div><div class="cf">“이번 판에서 보낸 알 수예요. 숫자가 찰 때마다 알이 이상해지고, 판이 끝나면 다시 0부터!”</div></div>`;
  EGGM.forEach(m=>{const ok=EGG.n>=m.n,u=m.u&&UB[m.u];h+=`<div class="cd ${ok?'lg':'lock'}"><div class="ci">${u?dxImg('u_'+u.id):`<i class="noimg">${m.ic}</i>`}<span class="tr ${ok?'lg':''}">🥚${m.n}</span></div><div class="cn">${m.ic} ${ok?m.t:'???'}</div><div class="cf">${ok?m.d:`한 판에 수상한 알 ${m.n}개를 보내면 열려요 (${EGG.n}/${m.n})`}</div></div>`});
  if(eggHas('hatch'))h+=H('🐣 부화 병아리','내 속성에 따라 달라져요')+U.filter(u=>u.hidden).filter(u=>(u.id!=='hatch_gold'||eggHas('gold'))&&(u.id!=='hatch_dino'||eggHas('dino'))).map(cardU).join('');
  h+=H('🐣 기본 새','누구나 보낼 수 있어요')+U.filter(u=>!u.x&&!u.tech&&!u.combo&&!u.hidden&&!u.secret&&!u.race).map(cardU).join('');
  h+=H('★ 특수 능력 새','지나가며 말썽을 부려요')+U.filter(u=>u.x&&!u.tech&&!u.combo&&!u.hidden&&!u.race&&(!u.secret||eggHas(u.secret))).map(cardU).join('');
  h+=H('🔮 속성 전용 새','그 속성을 골라야 해금')+U.filter(u=>u.tech).map(cardU).join('');
  h+=H('✨ 조합 새','속성 2개를 모두 골라야 해금')+U.filter(u=>u.combo).map(cardU).join('')+H('🏰 종족 전용 새','종족을 골라야 보낼 수 있어요')+U.filter(u=>u.race).map(cardU).join('')}
 else if(dxPage==='t'){h+=H('🏗 공용 타워','처음부터 지을 수 있어요')+T.filter(t=>!t.tech&&!t.combo&&!t.race).map(cardT).join('');
  TK.forEach(k=>{h+=H(`${TECH[k].ic} ${TECH[k].n} 속성`,TECH[k].d)+T.filter(t=>t.tech===k).map(cardT).join('')});
  h+=H('✨ 조합 타워','두 속성을 모두 고르면 해금')+T.filter(t=>t.combo).map(cardT).join('')+H('🏰 종족 전용 타워','종족을 골라야 지을 수 있어요')+T.filter(t=>t.race).map(cardT).join('')}
 else if(dxPage==='r')h+=raceDex();else h+=H('✨ 속성 조합 도감',`10가지 조합 · 첫 속성 무료, 두 번째 ${TECH2C}G`)+COMBO.map(cardC).join('');
 $('dexb').innerHTML=h;$('dexb').scrollTop=0}
function dxOpen(){dxPrev=S?paused:null;if(S){paused=true;$('pz').textContent='▶️'}$('dexm').style.display='flex';
 if(!DXC.done){$('dexb').innerHTML='<p class="m" style="grid-column:1/-1;text-align:center;padding:40px">🎨 새들이 사진 찍는 중…</p>';setTimeout(()=>{dxThumbs();dxRender()},30)}else dxRender()}
function dxClose(){$('dexm').style.display='none';if(S&&dxPrev!==null){paused=dxPrev;$('pz').textContent=paused?'▶️':'⏸'}}
$('dext').onclick=e=>{const p=e.target.dataset&&e.target.dataset.p;if(p){dxPage=p;dxRender()}};
$('dexx').onclick=dxClose;$('dxo').onclick=dxOpen;$('dxb').onclick=dxOpen;

$('mm').addEventListener('pointerdown',e=>{if(!S)return;const r=$('mm').getBoundingClientRect(),dx=e.clientX-r.left-r.width/2,dy=e.clientY-r.top-r.height/2;
 if(Math.hypot(dx,dy)<8){if(!S.pl[0].alive)return toast('💀 내 진영은 탈락했어요');view=0;ui();return}let a=Math.atan2(dy,dx)+Math.PI/2;while(a<0)a+=Math.PI*2;{const v=(Math.floor(a/(Math.PI/4))%8-S.off+8)%8;if(!S.pl[v].alive)return toast('💀 탈락한 진영이에요');view=v}sel=null;insp=null;ui()});
$('dif').innerHTML=Object.keys(DIFF).map(k=>`<button data-k="${k}">${DIFF[k].n.replace(' ','<br>')}</button>`).join('');
function setDiff(k){diff=k;[...$('dif').children].forEach(b=>b.className=b.dataset.k===k?'on':'');$('dd').textContent='💡 '+DIFF[k].d;lobUI()}
$('dif').onclick=e=>{if(e.target.dataset.k)setDiff(e.target.dataset.k)};setDiff('N');
// ---------- 🪶 깃털 코인 · 모드 선택 · 종족 해금 ----------
const SAVE_KEY='jjj_save_v1',MODE_COST=0,RACE_COST=30,COIN_WIN={N:2,M:3,H:4,X:6,Z:10,A:15};
let SV={coins:0,modeOK:0,races:[],wins:0},gameMode='normal',raceView=null;
try{const sv=JSON.parse(localStorage.getItem(SAVE_KEY)||'null');if(sv&&typeof sv==='object')SV=Object.assign(SV,sv)}catch(e){}
SV.heroes=SV.heroes||[];if(SV.hero&&SV.hero.id&&!SV.heroes.includes(SV.hero.id)&&!['chick','duck','penguin'].includes(SV.hero.id))SV.heroes.push(SV.hero.id);
if(!Array.isArray(SV.races))SV.races=[];
const svSave=()=>{try{localStorage.setItem(SAVE_KEY,JSON.stringify(SV))}catch(e){}};
if(SV.races.length)raceSel=SV.races[0];
let ttT=0;function tmsg(t){const E=[$('tmsg'),$('ltmsg'),$('rtmsg')].filter(Boolean);E.forEach(e=>e.textContent=t);clearTimeout(ttT);ttT=setTimeout(()=>E.forEach(e=>e.textContent=''),3200)}
function setMode(m){
 if(m==='race'&&!SV.modeOK){if(SV.coins<MODE_COST)return tmsg(`🪶 깃털 코인이 부족해요 (${SV.coins}/${MODE_COST}) · 일반 모드에서 승리하면 얻어요`);
  SV.coins-=MODE_COST;SV.modeOK=1;svSave();tmsg('🏰 종족 모드 해금! 종족 1개를 무료로 골라요')}
 gameMode=m;renderTitle();if(m==='race')ovl('racem',1)}
function renderTitle(){
 $('fc').textContent=SV.coins;const mb=$('mode').children;
 mb[0].className='mcard mn'+(gameMode==='normal'?' on':'');mb[1].className='mcard mr'+(gameMode==='race'?' on':'')+(SV.modeOK?'':' lk');
 mb[1].lastChild.textContent=SV.modeOK?'종족 특성 · 전용 타워/새':(MODE_COST?`🔒 ${MODE_COST}🪶로 해금`:'🔒 눌러서 무료 해금');
 $('md').innerHTML=gameMode==='race'?`🏰 종족 모드(베타) · ${SV.races.includes(raceSel)?RACE[raceSel].ic+' <b>'+RACE[raceSel].n+'</b>':'종족을 골라 주세요'} <button id="rpick" class="rpick">종족 고르기</button>`:'🐥 종족 없이 모든 새·타워를 공용으로 쓰는 기본 규칙이에요.';
 {const rp=$('rpick');if(rp)rp.onclick=()=>ovl('racem',1)}if(gameMode==='race')renderRaces();
 $('go').textContent='플레이';lobUI()}
function renderRaces(){const free=!SV.races.length,vk=raceView||(SV.races.includes(raceSel)?raceSel:RK_KEYS[0]);
 $('rc').innerHTML=RK_KEYS.map(k=>{const own=SV.races.includes(k);return `<button data-k="${k}" class="${own?(raceSel===k?'on':''):'lk'}"><i>${RACE[k].ic}</i><b>${RACE[k].n}</b><small>${own?RACE[k].tag:'🔒 '+(free||!RACE_COST?'무료 선택':RACE_COST+'🪶')}</small></button>`}).join('');
 const r=RACE[vk],own=SV.races.includes(vk),tw=T.filter(t=>t.race===vk).map(t=>t.ic+t.n).join(', '),un=U.filter(u=>u.race===vk).map(u=>u.ic+u.n).join(', ');
 $('rd').innerHTML=`<b style="color:${r.col}">${r.ic} ${r.n}</b> · ${r.d}<br>✨ ${r.p}<br>🏗 전용 타워: ${tw}<br>🐦 전용 새: ${un}<br>🚫 못 쓰는 것: ${r.ban.map(id=>(TB[id]||UB[id]).n).join(', ')}`+(own?'':`<br><button class="big" id="rbuy" style="margin-top:8px;padding:10px;font-size:14px">${free||!RACE_COST?'🎁 이 종족을 선택':`🔓 ${RACE_COST}🪶로 해금`}</button>`);
 const bb=$('rbuy');if(bb)bb.onclick=()=>buyRace(vk)}
function buyRace(k){if(SV.races.includes(k))return;const free=!SV.races.length;
 if(!free&&SV.coins<RACE_COST)return tmsg(`🪶 깃털 코인이 부족해요 (${SV.coins}/${RACE_COST})`);
 if(!free)SV.coins-=RACE_COST;SV.races.push(k);raceSel=k;raceView=k;svSave();tmsg(`${RACE[k].ic} ${RACE[k].n} 해금!`);renderTitle()}
$('racex').onclick=()=>{if(!SV.races.includes(raceSel))return tmsg('🏰 먼저 종족을 하나 골라 주세요');ovl('racem',0);renderTitle()};
$('rc').onclick=e=>{const b=e.target.closest('button');if(!b||!b.dataset.k)return;const k=b.dataset.k;raceView=k;if(SV.races.includes(k))raceSel=k;renderTitle()};
$('mode').onclick=e=>{const b=e.target.closest('button');if(b&&b.dataset.m)setMode(b.dataset.m)};
function tryStart(){if(gameMode==='race'){if(!SV.modeOK){openMode();return setMode('race')}if(!SV.races.includes(raceSel)){openMode();ovl('racem',1);return tmsg('🏰 먼저 종족을 하나 골라 주세요')}}start()}
function rewardUI(win){const e=$('ew');if(!e)return;if(S.sim){e.innerHTML='';return}if(S.rwd){return}S.rwd=1;
 /* 🪶 깃털: 우승은 난이도별(E2·N3·M4·H6·X8), 진 판도 등수대로 2~4등 2개 · 5~8등 1개 */
 const rank=win?1:S.pl.filter(p=>p.alive).length+1,c=win?(COIN_WIN[diff]||3):rank<=4?2:1;SV.coins+=c;if(win)SV.wins++;svSave();
 let h=`<div class="rw">🪶 깃털 +${c} <small>(${win?'우승':rank+'등'} · 보유 ${SV.coins})</small></div>`;
 if(win&&!SV.modeOK)h+=`<div class="m">종족 모드 해금까지 ${Math.min(SV.coins,MODE_COST)}/${MODE_COST}</div>`;
 e.innerHTML=h}
$('tipo').onclick=()=>{$('tipm').style.display='flex'};$('tipx').onclick=()=>{$('tipm').style.display='none'};

// ---------- 🏠 로비 · 🎨 영웅 꾸미기 · 🏞 광장 ----------
/* 🎨 꾸미기(색·모자·얼굴)는 2026-11-11 사용자 요청으로 완전히 뺌 — 영웅은 새 종류 + 이름만 */
const NICKS=['깃털장인','짹짹대장','먹이도둑','둥지부자','부리부리','날개짱','삐약대장','구구구','꽥꽥이','새벽수탉','모이왕','하늘산책'];
const heroPool=()=>U.filter(u=>!u.hidden&&u.id!=='egg_legs'&&!u.race);
/* 🐣 제작 영웅(유저 제작 3D 영웅, 롤토체스 꼬마 전설이·겟앰프드 유저 아이템 방식): 싸우는 새가 아니라 로비·광장·게임판 미니 영웅으로만.
   신작은 한 달 판매(until까지 구매 가능, 산 사람은 계속 보유), 테스트 기간 가격 깃털 500. HERO_ALL_OPEN과 상관없이 사야 열림. 모델은 HGLB에 같은 id로 */
const CHERO=[{id:'c_chick',n:'3D 삐약이',ic:'🐣',by:'Avian Influencer',p:500,until:'2026-12-11',d:'뼈대가 있어서 걷고 날갯짓하는 진짜 3D 삐약이'},
 {id:'c_ai',n:'AI 기자',ic:'🚁',by:'Avian Influencer',p:500,until:'2026-12-11',d:'짹짹 뉴스 마스코트, 드론 병아리 기자'}];
const CHB=Object.fromEntries(CHERO.map(c=>[c.id,c]));
const chOn=c=>!c.until||Date.now()<new Date(c.until+'T23:59:59+09:00').getTime();
/* 영웅 정보: 새 종류(UB) 또는 제작 영웅 */
function hInfo(id){const c=CHB[id];if(c)return{id,n:c.n,ic:c.ic,custom:1,c};const u=UB[id]||UB.chick;return{id:u.id,n:u.sn||u.n,ic:u.ic,u}}
const heroValid=id=>!!(CHB[id]||(UB[id]&&heroPool().some(u=>u.id===id)));
/* 🪶 영웅 해금: 기본 3마리 무료, 나머지는 깃털로. 테스트 기간엔 HERO_ALL_OPEN=true로 전부 열어 둠(출시 때 false) */
const HERO_ALL_OPEN=true,HERO_FREE=['chick','duck','penguin'];
const heroPrice=u=>u.c<300?10:u.c<700?20:u.c<2000?30:50;
const heroOwn=id=>CHB[id]?(SV.heroes||[]).includes(id):HERO_ALL_OPEN||HERO_FREE.includes(id)||(SV.heroes||[]).includes(id);
let hOwned=null;/* 꾸미기 창을 열 때 마지막으로 가진 영웅(잠긴 새를 구경만 하고 닫으면 되돌림) */
if(!SV.hero||!heroValid(SV.hero.id))SV.hero={id:'chick',name:'짹짹이'};delete SV.hero.col;delete SV.hero.hat;delete SV.hero.face;
function heroTag(){try{return hInfo(SV.hero.id).ic+SV.hero.name}catch(e){return '나'}}
const hexS=c=>'#'+c.toString(16).padStart(6,'0');
function headPos(id){const tall=id==='ostrich',z0=tall?.6:.26+(LIFT[id]||0);if(HEADX[id])return HEADX[id];return{hz:tall?1.3:z0+.2,hy:tall?-.28:-.3,hr:id==='owl'?.2:id==='chick'?.17:.15}}
// 🧸 AI 3D 영웅 모델(Hyper3D Rodin → assets/models/*.glb, 1.2만 면·512 텍스처). 로비·꾸미기·광장에서만 써요(게임판은 가벼운 기존 모델)
// h: 키, hp: 모자·안경 위치(머리 높이 hz·앞뒤 hy·반지름 hr, 눈 ey·ez·간격 ex)
const HGLB={c_chick:{f:'assets/models/chick_anim.glb',h:.75},c_ai:{f:'assets/models/ai_mascot.glb',h:.85}},HG={};
/* 뼈대 모델은 포즈를 입힌 실제 꼭짓점으로 크기를 재요(뼈에 배율이 있으면 Box3가 틀림) */
function skinBox(o){const b=new THREE.Box3(),v=new THREE.Vector3();let sk=0;o.traverse(m=>{if(!m.isSkinnedMesh)return;sk=1;const p=m.geometry.attributes.position;m.skeleton.update();for(let i=0;i<p.count;i+=3){v.fromBufferAttribute(p,i);m.boneTransform(i,v);v.applyMatrix4(m.matrixWorld);b.expandByPoint(v)}});return sk?b:b.setFromObject(o)}
function hglbGet(id){const d=HGLB[id];if(!d||!THREE.GLTFLoader)return null;const c=HG[id];if(c)return c.st==='ok'?c.s:null;HG[id]={st:'load'};
 new THREE.GLTFLoader().load(d.f,g=>{const sc=g.scene,w=new THREE.Group();w.userData.clips=g.animations||[];sc.rotation.x=PI/2;w.add(sc);sc.updateMatrixWorld(true);const bx=skinBox(sc),k=d.h/Math.max(.01,bx.max.z-bx.min.z);sc.scale.setScalar(k);sc.position.z=-bx.min.z*k;
  sc.traverse(o=>{if(o.isMesh){const t=o.material.map||o.material.emissiveMap;if(t)t.encoding=THREE.LinearEncoding;o.material=new THREE.MeshBasicMaterial({map:t,skinning:!!o.isSkinnedMesh});o.geometry.userData.cached=true}});
  HG[id]={st:'ok',s:w};LHK=''},null,()=>{HG[id]={st:'fail'}});return null}
/* 뼈대(스킨) 있는 모델 복제: 그냥 clone하면 뼈가 원본을 가리켜서 따로 못 움직임 */
function skinClone(src){const c=src.clone(true),sL=new Map(),cL=new Map();const par=(a,b)=>{sL.set(b,a);cL.set(a,b);a.children.forEach((k,i)=>par(k,b.children[i]))};par(src,c);
 c.traverse(o=>{if(!o.isSkinnedMesh)return;const so=sL.get(o),sk=so.skeleton.clone();sk.bones=so.skeleton.bones.map(b=>cL.get(b));o.bind(sk,so.bindMatrix)});return c}
function heroMeshAI(cfg,b0){const src=hglbGet(cfg.id);if(!src)return null;const m=new THREE.Group(),c=skinClone(src);m.add(c);
 if(src.userData.clips.length){const mx=new THREE.AnimationMixer(c),A={};src.userData.clips.forEach(k=>A[k.name]=mx.clipAction(k));m.userData.mix={mx,A,cur:null,t:null,ft:3+Math.random()*3}}
 m.userData.w=[];m.userData.b=b0;m.userData.ai=1;return m}
function heroMesh(cfg){const b0=UB[cfg.id]||UB.chick,ai=heroMeshAI(cfg,b0);if(ai)return ai;const b=b0.t==='A'?Object.assign({},b0,{t:'G'}):b0,m=birdMesh3(b,0x60a5fa);artFx('bird',{m,b,dex:true});// 영웅은 받침대 위에 서 있으니 공중 새도 날개 접고 발로 서게
 m.traverse(o=>{if(o.name==='artOutl'||(o.geometry&&o.geometry.type==='TorusGeometry'&&o.material&&o.material.color&&o.material.color.getHex()===0x60a5fa))o.visible=false;});// 영웅은 가까이 보니까 게임판용 외곽선·팀 고리는 숨겨요
 m.traverse(o=>{if(o.geometry&&o.geometry.type==='PlaneGeometry')o.visible=false;});
 m.userData.b=b0;return m}
/* 3D 영웅 애니메이션(idle·walk·flap): 걸으면 walk, 서 있으면 idle, 가끔 flap 한 번 */
function heroPlay(X,n,fade){const a=X.A[n];if(!a||X.cur===n)return;const o=X.A[X.cur];a.reset();if(n==='flap'){a.setLoop(THREE.LoopRepeat,2)}a.play();if(o)a.crossFadeFrom(o,fade||.2,false);X.cur=n}
function heroClip(X,t,walk){const dt=X.t==null?0:Math.min(.1,Math.max(0,t-X.t));X.t=t;X.ft-=dt;
 if(walk)heroPlay(X,'walk');else if(X.cur==='flap'){if(!X.A.flap.isRunning())heroPlay(X,'idle',.25)}else if(X.ft<=0&&X.A.flap){X.ft=5+Math.random()*4;heroPlay(X,'flap',.15)}else heroPlay(X,'idle',.3);
 X.mx.update(dt)}
const birdAnim=(m,t,walk)=>{const X=m.userData.mix;if(X){heroClip(X,t,walk);return}(m.userData.w||[]).forEach((q,i)=>q.rotation.y=(i?-1:1)*Math.sin(t*14)*.5);const bd=m.children[0];if(bd)bd.rotation.z=walk?Math.sin(t*12)*.16:Math.sin(t*2)*.04;if(m.userData.an)m.userData.an(t,m)};
// 공용 렌더러(로비·꾸미기·광장이 돌려 씀)
let LR=null,LS=null,LC=null,LH=null,LHK='',lobMode='lobby',lobT=0;
function lobLights(sc){sc.add(new THREE.AmbientLight(0xffffff,.5));sc.add(new THREE.HemisphereLight(0xe0f2ff,0x6b5a3a,.65));const d=new THREE.DirectionalLight(0xfff3d0,.95);d.position.set(3,-5,8);sc.add(d)}
function lobAttach(host){if(!LR){try{LR=new THREE.WebGLRenderer({antialias:true,alpha:true});LR.setPixelRatio(Math.min(devicePixelRatio,2))}catch(e){return}}if(LR.domElement.parentNode!==host)host.prepend(LR.domElement);LR._w=0}
function lobFit(cam){const el=LR.domElement.parentNode;if(!el)return;const w=el.clientWidth,h=el.clientHeight;if(w&&h&&(LR._w!==w||LR._h!==h)){LR._w=w;LR._h=h;LR.setSize(w,h)}if(LR._h){cam.aspect=LR._w/LR._h;cam.updateProjectionMatrix()}}
function lobbyScene(){if(LS)return;LS=new THREE.Scene();lobLights(LS);
 const ped=new THREE.Mesh(new THREE.CylinderGeometry(.75,.85,.3,40),new THREE.MeshStandardMaterial({color:0xf59e0b,metalness:.5,roughness:.35}));ped.rotation.x=PI/2;ped.position.z=-.15;LS.add(ped);
 const top=new THREE.Mesh(new THREE.CylinderGeometry(.68,.68,.02,40),new THREE.MeshStandardMaterial({color:0xfde68a,metalness:.3,roughness:.4}));top.rotation.x=PI/2;top.position.z=.01;LS.add(top);
 const ring=new THREE.Mesh(new THREE.TorusGeometry(.8,.035,10,48),new THREE.MeshBasicMaterial({color:0xfde047}));ring.position.z=-.02;LS.add(ring);
 const glass=new THREE.Mesh(new THREE.SphereGeometry(1,32,24),new THREE.MeshStandardMaterial({color:0xbfe9ff,transparent:true,opacity:.13,roughness:.05,metalness:.2,depthWrite:false}));glass.scale.set(.82,.82,1.12);glass.position.z=.95;glass.name='glass';LS.add(glass);
 LC=new THREE.PerspectiveCamera(30,1,.1,50);LC.up.set(0,0,1)}
function lobbyFrame(t){lobbyScene();const k=JSON.stringify(SV.hero);if(k!==LHK){if(LH){LS.remove(LH);LH.traverse(o=>{if(o.material)o.material.dispose();if(o.geometry&&!o.geometry.userData.cached)o.geometry.dispose()})}LH=heroMesh(SV.hero);LH.scale.setScalar(SV.hero.id==='ostrich'?.75:1.15);LS.add(LH);LHK=k}
 const tall=SV.hero.id==='ostrich';LH.rotation.z=Math.sin(t*.7)*.55;LH.position.z=.02+Math.abs(Math.sin(t*2.2))*.04;birdAnim(LH,t,false);
 const hero=lobMode==='hero';LS.getObjectByName('glass').visible=!hero;
 const cz=hero?.55:.85;LC.position.set(0,hero?-4.2:-6.4,hero?1.6:2.3);LC.lookAt(0,0,cz);lobFit(LC);try{aiLobby(t,hero)}catch(e){}LR.render(LS,LC)}
// 광장(지금은 AI 친구들 · 온라인 연결은 이 구조에 그대로 붙일 예정)
let PZ=null;const EMO=['😀','😂','😍','🥳','😡','😭','👍','❤️','💤','❓'];
const PZL=['안녕하세요~','8인전 같이 하실 분!','펭귄 삼형제 너무 귀여워요','공작 부채 예쁘다…','과자 타워 어디 있어요?','종족전 해금했어요!','ㅋㅋㅋㅋ','도도는 왜 안 죽어요?','갈매기 똥 조심!','릴레이 가즈아!','오늘 3연승 했어요','다들 영웅 뭐 쓰세요?'];
function pzBird(cfg,name,me){const m=heroMesh(cfg);m.scale.setScalar(.8);PZ.sc.add(m);const el=document.createElement('div');el.className='pb';el.innerHTML=`<div class="bb" style="display:none"></div><div class="pn${me?' me':''}"></div>`;el.lastChild.textContent=name;$('plo').append(el);
 const a=Math.random()*PI*2,r=me?0:2+Math.random()*4;return{m,el,bb:el.firstChild,name,me,air:(UB[cfg.id]||{}).t==='A',x:Math.cos(a)*r,y:Math.sin(a)*r-(me?2.6:0),tx:0,ty:0,wait:Math.random()*3,say:0,ph:Math.random()*9}}
function pzBuild(){const sc=new THREE.Scene();lobLights(sc);PZ={sc,b:[],t:0,nt:2,log:[]};
 const R0=.5,geo=new THREE.CylinderGeometry(R0*.96,R0*.96,.16,6);geo.rotateX(PI/2);const cells=[];
 for(let q=-14;q<=14;q++)for(let r=-14;r<=14;r++){const x=Math.sqrt(3)*R0*(q+r/2),y=1.5*R0*r,d=Math.hypot(x,y);if(d<8.2)cells.push([x,y,d])}
 const im=new THREE.InstancedMesh(geo,new THREE.MeshStandardMaterial({roughness:.9}),cells.length),o=new THREE.Object3D(),c=new THREE.Color(),G3=[0xa2d97a,0x8cc765,0x7ab553];
 const tc=new THREE.Color();cells.forEach(([x,y,d],i)=>{const path=d<1.9||(d>3.3&&d<4.1),k=pzSec(x,y),edge=Math.abs(((Math.atan2(y,x)-PZ_A0+PI*4)%(PI*2/5))-PI/5)>PI/5-.09;o.position.set(x,y,path?-.1:-.08);o.updateMatrix();im.setMatrixAt(i,o.matrix);c.setHex(d<1.9?0xf5ecd0:path?0xe8d9a8:G3[(i*7)%3]);
  if(d>=4.1&&!path)c.lerp(tc.setHex(PZ_FLOOR[k]),edge?.3:.78);c.multiplyScalar(.94+((i*37)%10)/80);im.setColorAt(i,c)});sc.add(im);
 const S3=(g,col,x,y,z,o2)=>{const m=new THREE.Mesh(g,new THREE.MeshStandardMaterial(Object.assign({color:col,roughness:.6},o2||{})));m.position.set(x,y,z);sc.add(m);return m};
 const cy=(a,b,h)=>{const g=new THREE.CylinderGeometry(a,b,h,28);g.rotateX(PI/2);return g};
 S3(cy(1.2,1.3,.35),0xd6d3d1,0,0,.1);S3(cy(1.05,1.05,.02),0x38bdf8,0,0,.28,{roughness:.1,metalness:.1,emissive:0x0369a1,emissiveIntensity:.25});S3(cy(.16,.22,.8),0xd6d3d1,0,0,.6);S3(cy(.45,.35,.12),0xd6d3d1,0,0,1);S3(new THREE.SphereGeometry(.18,16,12),0x7dd3fc,0,0,1.2,{emissive:0x38bdf8,emissiveIntensity:.5});
 for(let i=0;i<5;i++){const a=PZ_A0+i*PI*2/5,x=Math.cos(a)*7.3,y=Math.sin(a)*7.3;S3(cy(.09,.12,.6),0x92400e,x,y,.25);const k=new THREE.ConeGeometry(.55,1.1,18);k.rotateX(PI/2);S3(k,i%2?0x16a34a:0x22c55e,x,y,1.05);const k2=new THREE.ConeGeometry(.42,.8,18);k2.rotateX(PI/2);S3(k2,0x4ade80,x,y,1.55)}
 pzMonuments(sc,S3,cy);
 PZ.cam=new THREE.PerspectiveCamera(42,1,.1,100);PZ.cam.up.set(0,0,1);
 PZ.me=pzBird(SV.hero,SV.hero.name,1);PZ.b.push(PZ.me);
 const pool=heroPool();for(let i=0;i<7;i++){const u=pool[Math.floor(Math.random()*pool.length)];PZ.b.push(pzBird({id:u.id},NICKS[(i*5+Math.floor(Math.random()*12))%12]+'_'+(100+Math.floor(Math.random()*900)),0))}
 try{aiPlazaAdd()}catch(e){}
 pzHead();
 const ray=new THREE.Raycaster(),pl=new THREE.Plane(new THREE.Vector3(0,0,1),0),v=new THREE.Vector3();
 LR.domElement.addEventListener('pointerdown',e=>{if(lobMode!=='plaza')return;const r=LR.domElement.getBoundingClientRect();ray.setFromCamera({x:(e.clientX-r.left)/r.width*2-1,y:-(e.clientY-r.top)/r.height*2+1},PZ.cam);if(ray.ray.intersectPlane(pl,v)){const d=Math.hypot(v.x,v.y),k=d>7.4?7.4/d:1;PZ.me.tx=v.x*k;PZ.me.ty=v.y*k;PZ.me.go=1;pzNetSend({t:'go',x:+PZ.me.tx.toFixed(2),y:+PZ.me.ty.toFixed(2)})}})}
function pzSay(b,txt,emo){b.bb.textContent=txt;b.bb.className='bb'+(emo?' em':'');b.bb.style.display='block';b.say=emo?2.6:4.2;if(!emo){PZ.log.push([b.name,txt]);if(PZ.log.length>5)PZ.log.shift();$('plog').innerHTML=PZ.log.map(([n,t])=>`<div><b>${n.replace(/</g,'&lt;')}</b> ${t.replace(/</g,'&lt;')}</div>`).join('')}}
function pzNpc(){const n=PZ.b.filter(b=>!b.me&&!b.ai&&!b.net);return n[Math.floor(Math.random()*n.length)]}
function pzChat(txt){txt=(txt||'').trim().slice(0,40);if(!txt||!PZ)return;pzSay(PZ.me,txt);pzNetSend({t:'say',s:txt});if(pzNetN())return;if(PZ.ai&&/AI|ai|에이아이|뉴스|속보/.test(txt)){setTimeout(()=>{if(PZ&&PZ.ai)pzSay(PZ.ai,aiPick('chat'))},800);return}
 setTimeout(()=>{if(!PZ)return;const b=pzNpc();if(/안녕|하이|ㅎㅇ/.test(txt))pzSay(b,['안녕하세요!','ㅎㅇㅎㅇ','반가워요 '+SV.hero.name+'님!'][Math.floor(Math.random()*3)]);else if(/8인|같이|대전|ㄱㄱ/.test(txt))pzSay(b,'저요! 온라인 열리면 바로 갈게요');else if(Math.random()<.6)pzSay(b,EMO[Math.floor(Math.random()*EMO.length)],1)},900+Math.random()*900)}
function plazaFrame(t,dt){if(!PZ)pzBuild();PZ.t+=dt;PZ.nt-=dt;if(PZ.ai){PZ.ai.nt-=dt;if(PZ.ai.nt<=0){PZ.ai.nt=8+Math.random()*6;pzSay(PZ.ai,aiPick('plaza'))}}
 pzFxTick(t,dt);
 if(PZ.nt<=0){PZ.nt=2.5+Math.random()*3;const b=pzNpc();if(!pzNetN())Math.random()<.55?pzSay(b,PZL[Math.floor(Math.random()*PZL.length)]):pzSay(b,EMO[Math.floor(Math.random()*EMO.length)],1)}
 const cam=PZ.cam,me=PZ.me,v=new THREE.Vector3(),W=LR._w||1,H=LR._h||1;
 for(const b of PZ.b){if(b.ai){b.tx=me.x+1.6+Math.sin(t*.5)*.9;b.ty=me.y+1.3+Math.cos(t*.4)*.5;b.go=1}else if(!b.me&&!b.net){b.wait-=dt;if(b.wait<=0&&!b.go){const a=Math.random()*PI*2,r=2+Math.random()*5;b.tx=Math.cos(a)*r;b.ty=Math.sin(a)*r;b.go=1;b.wait=3+Math.random()*5}}
  let walk=false;if(b.go){const dx=b.tx-b.x,dy=b.ty-b.y,d=Math.hypot(dx,dy);if(d<.06)b.go=0;else{const sp=(b.me||b.net?2.6:1.3)*dt,k=Math.min(1,sp/d);b.x+=dx*k;b.y+=dy*k;walk=true;let to=Math.atan2(dx,-dy),cr=b.m.rotation.z,df=((to-cr+PI*3)%(PI*2))-PI;b.m.rotation.z=cr+df*Math.min(1,dt*10)}}
  const zb=b.ai?1.25+Math.sin(t*1.6)*.12:b.air?.55+Math.sin(t*2+b.ph)*.08:(walk?Math.abs(Math.sin(t*12+b.ph))*.06:0);b.m.position.set(b.x,b.y,zb);birdAnim(b.m,t+b.ph,walk);
  if(b.ai)aiSpin(b.m.children[0],t);if(b.say>0){b.say-=dt;if(b.say<=0)b.bb.style.display='none'}
  v.set(b.x,b.y,zb+(b.ai?.75:b.m.userData.b.id==='ostrich'?1.55:1.0)).project(cam);b.el.style.left=((v.x+1)/2*W)+'px';b.el.style.top=((1-v.y)/2*H)+'px';b.el.style.display=v.z<1?'flex':'none'}
 cam.position.set(me.x*.85,me.y*.85-7.2,7.4);cam.lookAt(me.x*.85,me.y*.85,0);lobFit(cam);LR.render(PZ.sc,cam)}
function lobLoop(now){requestAnimationFrame(lobLoop);const vis=$('title').style.display!=='none';if(!vis||!LR)return;const t=now/1000,dt=Math.min(.05,t-(lobT||t));lobT=t;
 try{lobMode==='plaza'?plazaFrame(t,dt):lobbyFrame(t)}catch(e){console.log(e)}}
// UI
function lobUI(){try{$('lwin').textContent=SV.wins||0;$('lhic').textContent=hInfo(SV.hero.id).ic;$('lnick').textContent=SV.hero.name;$('lname').textContent=SV.hero.name;
 $('lmodet').innerHTML=(gameMode==='race'?'🏰 종족 모드'+(SV.races.includes(raceSel)?' · '+RACE[raceSel].ic+RACE[raceSel].n:''):'🐥 일반 모드')+'<small class="lmd">난이도 '+DIFF[diff].n.split(' ').pop()+'</small>'}catch(e){}}
const ovl=(id,on)=>{$(id).style.display=on?'flex':'none'};
function openMode(){ovl('modem',1);renderTitle()}
function heroOpt(){const h=SV.hero,o=$('hopt');
 {const cu=hInfo(h.id),lk=!heroOwn(h.id),pr=cu.custom?cu.c.p:heroPrice(cu.u),sold=cu.custom&&!chOn(cu.c);
  const btn=u=>{const own=heroOwn(u.id),c=CHB[u.id];return `<button data-v="${u.id}" class="${h.id===u.id?'on':''}${own?'':' hlk'}${c?' hcus':''}"><i>${u.ic}</i>${c?c.n:u.sn||u.n}${own?'':c&&!chOn(c)?'<small>판매 종료</small>':`<small>🔒🪶${c?c.p:heroPrice(u)}</small>`}</button>`};
  o.innerHTML=(lk?`<div class="hbuy">🔒 <b>${cu.n}</b> 구경 중 · ${sold?'판매가 끝났어요':`🪶${pr}로 해금 <button id="hbuyb">🔓 해금</button>`}</div>`:HERO_ALL_OPEN&&!cu.custom?'<div class="hnote">🧪 테스트 기간: 기본 영웅은 모두 열려 있어요</div>':'')+
   `<div class="hsec">🐣 제작 영웅 <small>신작은 한 달 한정 판매</small></div>`+CHERO.map(c=>btn({id:c.id,ic:c.ic})).join('')+
   (cu.custom?`<div class="hcred">🎨 제작: ${cu.c.by} · ${cu.c.d}${cu.c.until?` · ${chOn(cu.c)?`${cu.c.until.slice(5).replace('-','/')}까지 판매`:'판매 종료'}`:''}</div>`:'')+
   `<div class="hsec">🐦 기본 영웅</div>`+heroPool().map(btn).join('');
  const bb=$('hbuyb');if(bb)bb.onclick=e=>{e.stopPropagation();if(SV.coins<pr){$('hbuyb').textContent=`🪶 ${SV.coins}/${pr} 부족`;return}SV.coins-=pr;(SV.heroes=SV.heroes||[]).push(h.id);hOwned=h.id;svSave();sfx('unlock',{k:'hero'});heroOpt();lobUI();renderTitle()}}}
function openHero(){hOwned=heroOwn(SV.hero.id)?SV.hero.id:HERO_FREE[0];lobMode='hero';ovl('herom',1);lobAttach($('hpv'));$('hname').value=SV.hero.name;heroOpt()}
function closeHero(){const n=$('hname').value.trim();if(n)SV.hero.name=n.slice(0,10);if(!heroOwn(SV.hero.id))SV.hero.id=hOwned&&heroOwn(hOwned)?hOwned:HERO_FREE[0];svSave();ovl('herom',0);lobMode='lobby';lobAttach($('lstage'));lobUI()}
/* 🏞 광장 꾸미기: 가운데 분수 둘레를 속성 5구역(화염·빙결·뇌전·폭풍·독)으로 나누고, 구역마다 기념비 + 그 속성 스킬 픽셀 이펙트 */
const PZ_EL=['fire','ice','thunder','wind','dark'],PZ_A0=-PI/2-PI/5,PZ_FLOOR=[0xd9622e,0x7cc4e8,0xd9b02a,0x2fae8c,0x8f5fcf];/* 구역 바닥: 주황 흙·얼음·노란 모래·청록 풀·보라 늪 */
const PZ_FX={fire:['fire/flame-pillar',{fit:1.5}],ice:['ice/ice-shatter',{fit:1.9}],thunder:['lightning/lightning-strike',{fit:1.4}],wind:['nature/tornado',{fit:1.4,life:2.6,loop:true}],dark:['nature/toxic-gas',{fit:2.2,op:.55,life:3,loop:true}]};
function pzSec(x,y){return Math.floor(((Math.atan2(y,x)-PZ_A0)%(PI*2)+PI*2)%(PI*2)/(PI*2/5))}
function pzSecMid(k,r){const a=PZ_A0+(k+.5)*PI*2/5;return[Math.cos(a)*r,Math.sin(a)*r]}
function emoTex(t,col){const cv=document.createElement('canvas');cv.width=cv.height=128;const x=cv.getContext('2d');x.fillStyle=col;x.globalAlpha=.85;x.beginPath();x.arc(64,64,58,0,PI*2);x.fill();x.globalAlpha=1;x.lineWidth=6;x.strokeStyle='#000';x.stroke();x.font='68px sans-serif';x.textAlign='center';x.textBaseline='middle';x.fillText(t,64,70);return new THREE.CanvasTexture(cv)}
function pzMonuments(sc,S3,cy){PZ.mon=[];PZ_EL.forEach((e,k)=>{const T0=TECH[e],[x,y]=pzSecMid(k,5.6),hx='#'+T0.col.toString(16).padStart(6,'0');
  S3(cy(.55,.65,.25),0x57534e,x,y,.05);S3(cy(.32,.42,.5),0x78716c,x,y,.4);
  const cr=S3(new THREE.OctahedronGeometry(.32,0),T0.col,x,y,1.15,{emissive:T0.col,emissiveIntensity:.7,roughness:.25,flatShading:true});
  const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:emoTex(T0.ic,hx),depthWrite:false}));sp.scale.set(.5,.5,1);sp.position.set(x,y,1.8);sc.add(sp);
  /* 구역 소품 */const P=(g,col,dx,dy,z,o)=>S3(g,col,x+dx,y+dy,z,o);
  if(e==='fire'){P(cy(.55,.55,.04),0xea580c,0,0,-.05,{emissive:0xf97316,emissiveIntensity:.6});[[-.9,.4],[.8,-.5]].forEach(([a,b])=>{const k2=new THREE.ConeGeometry(.16,.4,8);k2.rotateX(PI/2);P(k2,0xfb923c,a,b,.2,{emissive:0xf97316,emissiveIntensity:.5})})}
  else if(e==='ice'){[[-.9,.3,.6],[.85,-.4,.45],[.3,.95,.35]].forEach(([a,b,h])=>{const k2=new THREE.ConeGeometry(.15,h,6);k2.rotateX(PI/2);P(k2,0xbae6fd,a,b,h/2,{transparent:true,opacity:.85,roughness:.1,emissive:0x67e8f9,emissiveIntensity:.25})})}
  else if(e==='thunder'){[-.85,.85].forEach(a=>{P(cy(.04,.05,1.1),0x64748b,a,0,.55);P(new THREE.SphereGeometry(.09,10,8),0xfde047,a,0,1.12,{emissive:0xfacc15,emissiveIntensity:.9})})}
  else if(e==='wind'){[[-.9,.2],[.8,.6]].forEach(([a,b])=>{P(cy(.03,.04,.9),0xe2e8f0,a,b,.45);const fl=new THREE.ConeGeometry(.12,.35,4);fl.rotateZ(PI/2);P(fl,0x2dd4bf,a+.17,b,.82)})}
  else{[[-.85,.35],[.8,-.3],[.2,-.9]].forEach(([a,b])=>{P(cy(.04,.05,.18),0xf5f5f4,a,b,.09);P(new THREE.SphereGeometry(.16,12,8,0,PI*2,0,PI/2).rotateX(PI/2),0x7e22ce,a,b,.17,{emissive:0x84cc16,emissiveIntensity:.15})})}
  PZ.mon.push({cr,e,x,y,ph:k*1.3})});PZ.fxT=1;PZ.sec=-1}
function pzFxTick(t,dt){if(!PZ.mon)return;PZ.mon.forEach(m=>{m.cr.rotation.z=t*.8+m.ph;m.cr.position.z=1.15+Math.sin(t*1.6+m.ph)*.08});
 const play=(e,x,y)=>{const f=PZ_FX[e];if(f&&PXS.has(f[0]))PXS.play(f[0],x,y,0,Object.assign({scene:PZ.sc,cam:PZ.cam},f[1]))};
 PZ.fxT-=dt;if(PZ.fxT<=0){PZ.fxT=1.6+Math.random()*2.2;const m=PZ.mon[Math.floor(Math.random()*5)],a=Math.random()*PI*2,r=.6+Math.random()*1.1;play(m.e,m.x+Math.cos(a)*r,m.y+Math.sin(a)*r)}
 const me=PZ.me,d=Math.hypot(me.x,me.y),k=d>4.1?pzSec(me.x,me.y):-1;if(k!==PZ.sec){PZ.sec=k;if(k>=0){const e=PZ_EL[k],T0=TECH[e];play(e,me.x,me.y);toast(`${T0.ic} ${T0.n} 구역 · ${T0.d}`)}}
 PXS.update(dt)}
/* 🔗 광장 초대: 광장에 들어가면 방 코드가 생기고(내가 주인), 초대 링크(?plaza=코드)로 친구가 들어와요. 서버 없이 8인 대전과 같은 기기끼리 연결(PeerJS), 최대 8명 */
const PZN={role:null,code:'',tr:null,peers:{},st:''};
const pzNetN=()=>Object.keys(PZN.peers).length;
function pzHead(){const e=$('pzn');if(!e)return;const n=pzNetN(),ai=PZ?PZ.b.filter(b=>!b.me&&!b.net).length:0;
 e.innerHTML=(PZN.code?`<span class="pzc">🏷 <b>${PZN.code}</b></span><button id="pzinv">📨 초대</button>`:'')+`<button id="pzjn">🔑 코드</button><small>${PZN.st||(n?`👥 친구 ${n}명 · AI ${ai}`:`👥 AI 친구 ${ai}`)}</small>`;
 const iv=$('pzinv');if(iv)iv.onclick=pzInvite;$('pzjn').onclick=()=>{const c=(prompt('친구 광장 코드 5자리를 넣어 주세요')||'').trim().toUpperCase();if(/^[A-Z0-9]{5}$/.test(c)&&c!==PZN.code){pzNetStop();pzNetStart(c)}}}
async function pzInvite(){const u=new URL(location.href);u.searchParams.delete('room');u.searchParams.set('plaza',PZN.code);const url=u.toString(),txt=`🏞 새떼 주의보 광장에 놀러 와요! 광장 코드: ${PZN.code}\n${url}`;
 try{if(navigator.share){await navigator.share({title:'새떼 주의보 광장',text:txt,url});return}}catch(e){}try{await navigator.clipboard.writeText(txt);toast('📋 광장 초대 링크를 복사했어요')}catch(e){prompt('초대 링크를 복사해 주세요',url)}}
const pzHello=()=>({t:'hi',n:String(SV.hero.name||'짹짹이').slice(0,10),h:{id:SV.hero.id}});
function pzAdd(id,n,h,x,y){if(!PZ||PZN.peers[id])return;const hc=heroSafe(h),b=pzBird(hc,'👤'+String(n||'친구').slice(0,10),0);b.net=1;b.cfgId=hc.id;b.x=+x||0;b.y=+y||-2;b.tx=b.x;b.ty=b.y;b.go=0;PZ.b.push(b);PZN.peers[id]=b;pzHead()}
function pzDel(id){const b=PZN.peers[id];if(!b)return;PZ.sc.remove(b.m);b.el.remove();PZ.b=PZ.b.filter(o=>o!==b);delete PZN.peers[id];pzHead()}
function pzOn(id,d){const b=PZN.peers[id];if(!b||!d)return;if(d.t==='go'){const r=Math.hypot(+d.x,+d.y),k=r>7.4?7.4/r:1;b.tx=(+d.x||0)*k;b.ty=(+d.y||0)*k;b.go=1}else if(d.t==='say'&&typeof d.s==='string')pzSay(b,d.s.slice(0,40),!!d.e)}
const pzBC=(d,skip)=>{if(PZN.role!=='host')return;for(const id in PZN.peers)if(id!==skip)PZN.tr.send(id,d)};
function pzNetSend(d){if(!PZN.tr)return;if(PZN.role==='host')pzBC(Object.assign({id:'H'},d));else PZN.tr.send(d)}
function pzNetStart(join){if(PZN.tr||typeof NET==='undefined'||!NET.pzHost)return;if(!PZ)pzBuild();
 if(join){PZN.role='guest';PZN.code=join;PZN.st='🔌 친구 광장에 들어가는 중…';pzHead();
  PZN.tr=NET.pzGuest(join,{ready:()=>{PZN.tr.send(pzHello())},msg:d=>{if(!d||!d.t)return;
    if(d.t==='roster'){PZN.st='';(d.list||[]).forEach(p=>pzAdd(p.id,p.n,p.h,p.x,p.y));toast('🏞 친구 광장에 들어왔어요');pzHead()}
    else if(d.t==='add')pzAdd(d.id,d.n,d.h,d.x,d.y);else if(d.t==='bye')pzDel(d.id);else if(d.t==='full'){toast('광장이 꽉 찼어요(8명)');pzNetStop();pzNetStart()}else pzOn(d.id,d)},
   close:()=>{if(PZN.role!=='guest')return;toast('🏞 광장 주인이 나갔어요 · 내 광장으로 돌아왔어요');pzNetStop();if(lobMode==='plaza')pzNetStart()},
   err:e=>{toast(e==='noroom'?'그 코드의 광장이 없어요':'광장 연결이 안 됐어요');pzNetStop();if(lobMode==='plaza')pzNetStart()},slow:()=>{PZN.st='⏳ 연결이 느려요…';pzHead()}});return}
 PZN.role='host';PZN.code=NET.newCode();PZN.st='';pzHead();
 PZN.tr=NET.pzHost(PZN.code,{ready:()=>pzHead(),err:e=>{if(e==='taken'){pzNetStop();pzNetStart();return}PZN.code='';PZN.st='📴 오프라인 (초대 불가)';pzHead()},
  join:()=>{},leave:id=>{pzDel(id);pzBC({t:'bye',id})},
  msg:(id,d)=>{if(!d||!d.t)return;if(d.t==='hi'){if(pzNetN()>=7){PZN.tr.send(id,{t:'full'});return}
     const me=PZ.me,list=[{id:'H',n:SV.hero.name,h:{id:SV.hero.id},x:+me.x.toFixed(2),y:+me.y.toFixed(2)}].concat(Object.entries(PZN.peers).map(([k,b])=>({id:k,n:b.name.replace('👤',''),h:{id:b.cfgId},x:+b.x.toFixed(2),y:+b.y.toFixed(2)})));
     pzAdd(id,d.n,d.h,0,-2.6);const nb=PZN.peers[id];PZN.tr.send(id,{t:'roster',list});pzBC({t:'add',id,n:String(d.n||'').slice(0,10),h:{id:nb&&nb.cfgId},x:0,y:-2.6},id);toast(`👤 ${String(d.n||'친구').slice(0,10)}님이 광장에 왔어요`);return}
    pzOn(id,d);if(d.t==='go'||d.t==='say')pzBC(Object.assign({},d,{id}),id)}})}
function pzNetStop(){try{PZN.tr&&PZN.tr.close()}catch(e){}PZN.tr=null;Object.keys(PZN.peers).forEach(pzDel);PZN.role=null;PZN.code='';PZN.st=''}
window.addEventListener('load',()=>{const q=new URLSearchParams(location.search).get('plaza');if(q&&/^[A-Za-z0-9]{5}$/.test(q))setTimeout(()=>openPlaza(q.toUpperCase()),700)});
function openPlaza(join){lobMode='plaza';ovl('plaza',1);lobAttach($('plv'));if(PZ){PZ.me.x=0;PZ.me.y=-2.6;PZ.me.go=0}pzNetStart(join)}
function closePlaza(){pzNetStop();ovl('plaza',0);lobMode='lobby';lobAttach($('lstage'))}
$('hopt').onclick=e=>{const b=e.target.closest('button');if(!b)return;const v=b.dataset.v,h=SV.hero;h.id=v;if(heroOwn(v))hOwned=v;svSave();heroOpt();lobUI()};
$('hrand').onclick=()=>{const p=heroPool().filter(u=>heroOwn(u.id));SV.hero.id=p[Math.floor(Math.random()*p.length)].id;svSave();heroOpt();lobUI()};
$('herox').onclick=closeHero;$('heroo').onclick=openHero;$('lhero').onclick=openHero;$('lhint').onclick=openHero;
$('modeb').onclick=openMode;$('modex').onclick=()=>{ovl('modem',0);lobUI()};
/* 🛒 깃털 상점: 구글 Play 결제(TWA = Digital Goods API + Payment Request). 일반 웹 브라우저에서는 구매 불가 안내.
   상품은 플레이 콘솔 '인앱 상품'에 같은 id로 만들어야 해요(소모성). 받은 결제 토큰은 SV.ptok에 적어 두 번 지급을 막고, 지급 뒤 consume. 앱을 켤 때 남은 구매를 복원. */
const SHOP_ITEMS=[{sku:'feather_30',ic:'☕',n:'개발자 응원 팩',f:30,p:'₩1,000',d:'1인 개발자를 도와주세요 🙏'},
 {sku:'hero_make',ic:'🎨',n:'영웅 제작권',make:1,p:'₩5,000',d:'내가 만든 3D 새가 게임 영웅으로! 제작자 이름도 표시돼요'}],MAKE_TERMS='2026-11-11',PLAY_BILL='https://play.google.com/billing';
let DGS,DGP={};
async function shopSvc(){if(DGS!==undefined)return DGS;DGS=null;if('getDigitalGoodsService'in window){try{DGS=await window.getDigitalGoodsService(PLAY_BILL)}catch(e){DGS=null}}return DGS}
function shopGrant(tok,sku){const it=SHOP_ITEMS.find(x=>x.sku===sku);SV.ptok=SV.ptok||[];if(!it||!tok||SV.ptok.includes(tok))return 0;SV.ptok.push(tok);if(SV.ptok.length>60)SV.ptok.shift();
 if(it.make){/* 🎨 영웅 제작권: 주문 번호(결제 토큰 끝 8자리)를 보여 주고 메일에 적게 함 */(SV.orders=SV.orders||[]).push({code:tok.slice(-8).toUpperCase(),t:Date.now()});svSave();return 'make'}
 SV.coins+=it.f;svSave();try{lobUI();renderTitle()}catch(e){}return it.f}
async function shopRestore(){const s=await shopSvc();if(!s)return;try{for(const p of await s.listPurchases()){const g=shopGrant(p.purchaseToken,p.itemId);try{await s.consume(p.purchaseToken)}catch(e){}if(g)toast(g==='make'?'🎨 영웅 제작권을 받았어요 · 상점에서 주문 번호 확인':`🪶 구매한 깃털 +${g}개를 받았어요`)}}catch(e){}}
function shopUI(){$('shopn').textContent=SV.coins;const ok=SV.makeOK===MAKE_TERMS,od=(SV.orders||[]).slice(-3);
 $('shopl').innerHTML=SHOP_ITEMS.map(it=>`<div class="sitem${it.make?' smake':''}"><span class="sic">${it.ic}</span><span class="sin"><b>${it.n}</b>${it.make?'':`<em>🪶 깃털 ${it.f}개</em>`}<small>${it.d}</small>`+
  (it.make?`<a href="hero_make.html" target="_blank" class="slink">📖 만드는 법 · 프롬프트 · 저작권 안내 · 약관</a><label class="sagree"><input type="checkbox" id="mkok" ${ok?'checked':''}><span>안내와 약관을 읽고 동의해요<small>저작권 등으로 5회 반려 시 환불</small></span></label>`+
   (od.length?`<span class="sord">📨 주문 번호: ${od.map(o=>'<b>'+o.code+'</b>').join(' · ')}<br>메일 제목에 적어 .glb 파일을 보내 주세요</span>`:''):'')+
  `</span><button data-sku="${it.sku}" ${DGS&&(!it.make||ok)?'':'disabled'}>${DGP[it.sku]||it.p}</button></div>`).join('');
 const c=$('mkok');if(c)c.onchange=()=>{SV.makeOK=c.checked?MAKE_TERMS:null;svSave();shopUI()}}
async function openShop(){ovl('shopm',1);$('shopmsg').textContent='';shopUI();const s=await shopSvc();
 if(!s){$('shopmsg').textContent='💡 구매는 플레이 스토어에서 받은 앱에서만 할 수 있어요';shopUI();return}
 try{for(const d of await s.getDetails(SHOP_ITEMS.map(x=>x.sku))){try{DGP[d.itemId]=new Intl.NumberFormat('ko-KR',{style:'currency',currency:d.price.currency}).format(+d.price.value)}catch(e){}}}catch(e){}shopUI()}
async function shopBuy(sku){const s=await shopSvc();if(!s)return;const m=$('shopmsg');m.textContent='결제 창을 여는 중…';
 try{const rq=new PaymentRequest([{supportedMethods:PLAY_BILL,data:{sku}}],{total:{label:'합계',amount:{currency:'KRW',value:'0'}}});const rs=await rq.show(),tok=rs.details&&rs.details.purchaseToken;
  const g=shopGrant(tok,sku);try{await s.consume(tok)}catch(e){}await rs.complete('success');m.textContent=g==='make'?'🎨 영웅 제작권 구매 완료! 주문 번호를 메일에 적어 보내 주세요':g?`🎉 고마워요! 🪶 깃털 +${g}개`:'이미 받은 구매예요';shopUI();if(g)sfx('unlock',{k:'shop'})}
 catch(e){m.textContent=e&&e.name==='AbortError'?'구매를 취소했어요':'결제를 못 했어요. 잠시 뒤 다시 해 주세요'}}
$('shopl').onclick=e=>{const b=e.target.closest('button');if(b&&b.dataset.sku&&!b.disabled)shopBuy(b.dataset.sku)};
$('shopo').onclick=openShop;$('shopc').onclick=openShop;$('shopx').onclick=()=>{ovl('shopm',0);lobUI();renderTitle()};
window.addEventListener('load',()=>setTimeout(shopRestore,1500));
$('plz').onclick=()=>openPlaza();$('pzx').onclick=closePlaza;
$('pemo').innerHTML=EMO.map(e=>`<button>${e}</button>`).join('');$('pemo').onclick=e=>{const b=e.target.closest('button');if(b&&PZ){pzSay(PZ.me,b.textContent,1);pzNetSend({t:'say',s:b.textContent,e:1})}};
$('psend').onclick=()=>{pzChat($('pin').value);$('pin').value=''};$('pin').onkeydown=e=>{if(e.key==='Enter'){pzChat($('pin').value);$('pin').value=''}};
window.addEventListener('load',()=>{lobAttach($('lstage'));lobUI();requestAnimationFrame(lobLoop)});


// ---------- 📘 첫 판 튜토리얼 (4장 카드, 게임은 멈춘 채로) ----------
const TUT=[
 ['🚨','안녕! 난 AI야','인공지능 아니고… <b>A</b>vian <b>I</b>nfluencer, <b>조류 인플루언서</b>의 줄임말! 짹튜브 \'짹짹 뉴스\' 구독자 800만 새를 거느린 드론 병아리 기자야. 머리 사이렌은 장식 아니고 진짜 울려 🚨 지금부터 내가 딱 4가지만 알려 줄게!',null],
 ['🐦','내 판을 지켜요','화면의 육각 판이 내 진영이에요. 새들이 위에서 내려와 아래로 빠져나가면 ❤️ 라이프가 줄어요.',null],
 ['🏹','타워 세우기','<b>타워</b> 탭에서 타워를 고르고 빈 칸을 눌러 세워요. 시작할 때 아래에서 <b>속성</b>(🔥❄️⚡🌪️☠️)을 하나 고르면 전용 타워가 열려요. 타워로 길을 구불구불하게 만들면 새가 더 오래 맞아요.','t1'],
 ['🪶','새 보내기','<b>유닛 전송</b> 탭에서 새를 사면 다음 사람 진영으로 달려가요. 보낼 때마다 📈 인컴이 올라서 4초마다 돈이 더 들어와요.','t2'],
 ['🏆','이기는 법','라이프가 0이 되면 탈락! 8명 중 마지막까지 버틴 1명이 우승해요. 오른쪽 위 작은 지도를 누르면 다른 진영을 볼 수 있어요.','lane']];
function tutOpen(){if(!S||S.net||S.sim||$('tut'))return;const pv=paused;paused=true;let i=0;const o=document.createElement('div');o.id='tut';document.body.appendChild(o);
 const hl=id=>{document.querySelectorAll('.tuthl').forEach(e=>e.classList.remove('tuthl'));const e=id&&$(id);if(e)e.classList.add('tuthl')};
 const end=()=>{hl(null);o.remove();paused=pv;SV.tut=1;svSave()};
 const draw=()=>{const[ic,t,d,h]=TUT[i];hl(h);o.className=h==='lane'?'':'top';o.innerHTML=`<div class="tutc"><div class="tuti"><img class="tuai" src="assets/ui/ai.png" alt="AI"><i>${ic}</i></div><small class="tusp">📢 AI의 꿀팁</small><b>${t}</b><p>${d}</p><div class="tutd">${TUT.map((_,k)=>`<i class="${k===i?'on':''}"></i>`).join('')}</div><div class="tutb"><button class="tsk">건너뛰기</button><button class="tnx">${i<TUT.length-1?'다음 ▶':'시작! 🎉'}</button></div></div>`;
  o.querySelector('.tsk').onclick=end;o.querySelector('.tnx').onclick=()=>{if(++i>=TUT.length)end();else draw()}};draw()}
{const st0=start;start=function(gs,p0h){const r=st0.apply(this,arguments);if(!gs&&!SV.tut)setTimeout(tutOpen,400);return r}}
{const b=document.createElement('button');b.textContent='🗑 처음부터 다시 (저장 초기화)';b.className='tutre tutrs';b.onclick=()=>{if(!confirm('코인·승리·해금한 종족·영웅 꾸미기가 모두 지워지고 처음 상태로 돌아가요. 정말 초기화할까요?'))return;try{localStorage.removeItem(SAVE_KEY)}catch(e){}location.reload()};const tb=document.querySelector('#tipm .tipb');if(tb)tb.prepend(b)}
// ---------- 📢 마스코트 AI(Avian Influencer) 출연: 로비 · 튜토리얼 · 게임 속보 · 광장 · 결과 화면 ----------
const AIL={
 intro:['안녕! 난 AI야 📢','인공지능 아니고 Avian Influencer, 조류 인플루언서의 줄임말!','짹튜브 「짹짹 뉴스」 구독자 800만 새! 나를 누르면 또 말해 줄게 🚨'],
 lobby:['📢 속보: 도도새 또 살아 돌아옴. 아무도 안 놀람','꿀팁! 새를 막으면 그 새 값의 20%가 내 돈이야 💰','프로펠러가 4개인데 날개는 왜 있냐고? …패션이야','7분이 되면 피해 2배! 그 전에 수비를 튼튼히 🛡','옆 사람이 무너지면 그 새들이 나한테 와. 릴레이니까!','타조 발레 공연, 이번 주도 매진이래 🩰','영웅을 눌러서 다른 새로 바꿔 봐 🐦','구독·좋아요·알림 설정! …여긴 버튼이 없구나','광장에 자주 놀러 가. 거기서도 생방송 중이야 🎥','미로를 길게 만들수록 새가 오래 맞아. 이건 과학이야','속성 2개를 고르면 조합 스킬이 열려! 해금하면 내가 특종 낼게','오늘의 운세: 깡패 거위 조심 🪿'],
 plaza:['📢 광장 생중계 중! 다들 손 흔들어 👋','방금 들어온 제보: 펭귄 삼형제 또 줄 서서 다님','누가 내 사진 찍었어? 초상권 있다!','오늘의 인기 검색어 1위: 「도도새 안 죽는 법」','짹짹 뉴스 AI였습니다~ 다음 소식!','여기 분수대 물 마시지 마세요. 갈매기가 씻었어요','8인 온라인 대전이 열리면 제일 먼저 중계할게!'],
 chat:['불렀어? 📢 조류 인플루언서 AI 등장!','구독자 800만 새, 오늘도 생방송 중이야','AI는 인공지능 아니고 Avian Influencer라니까~','제보는 언제나 환영! 특종이면 1면에 실어 줄게'],
 win:['🎉 특종! {n} 우승! 내일 아침 1면이야','구독자 800만 새가 박수 치는 중 👏👏','오늘의 MVP 인터뷰 잡아 놨어. 한마디 해 줘!'],
 first:['🎉 역사적인 첫 우승! 짹짹 뉴스 단독 보도 📸 {n}, 소감 한마디!'],
 lose:['괜찮아, 다음 판은 내가 응원 생중계 해 줄게 📢','속보: {n}, 더 강해져서 돌아올 예정','새떼가 너무 셌어. 수비 타워를 조금 더 빨리!'],
 spec:['관전 끝! 오늘 경기 하이라이트는 내가 편집해 둘게 🎬']};
const aiPick=k=>{const L=AIL[k];return L[Math.floor(Math.random()*L.length)].replace('{n}',(SV&&SV.hero&&SV.hero.name)||'짹짹이')};
/* 프로펠러 잔상 돌리기 + 사이렌 깜빡이 */
function aiSpin(m,t){const u=m&&m.userData;if(!u||!u.rot)return;u.rot.forEach((r,i)=>r.rotation.z=t*(i%2?-38:38));const on=Math.floor(t*4)%2;if(u.glow){u.glow.material.color.setHex(on?0xff4d4d:0x4d8bff);u.glow.scale.setScalar(.45+.2*Math.abs(Math.sin(t*9)))}}
/* 로비: 영웅 오른쪽 위에 둥실 떠서 가끔 한마디, 누르면 바로 한마디 */
let LAI=null;const AIB={t:0,q:[],next:3};
function aiLobbyEl(){let b=$('aib');if(b)return b;b=document.createElement('div');b.id='aib';b.innerHTML='<button class="aibtn" aria-label="AI"></button><div class="aisp" style="display:none"></div>';$('title').append(b);
 b.firstChild.onclick=e=>{e.stopPropagation();aiLobbySay(AIB.q.length?AIB.q.shift():aiPick('lobby'))};return b}
function aiLobbySay(txt){const b=aiLobbyEl(),sp=b.lastChild;sp.textContent=txt;sp.style.display='block';sp.classList.remove('pop');void sp.offsetWidth;sp.classList.add('pop');AIB.t=Math.max(3.4,txt.length*.09)}
function aiLobby(t,hero){const b=aiLobbyEl();if(!LAI&&aiMascotGet()){const w=new THREE.Group(),m=aiMascotMesh();m.rotation.x=-.18;w.add(m);w.scale.setScalar(.42);LS.add(w);LAI=w;
  if(!SV.aiIntro){AIB.q=AIL.intro.slice();SV.aiIntro=1;svSave();AIB.next=1.2}}
 if(!LAI||hero){if(LAI)LAI.visible=false;b.style.display='none';return}
 LAI.visible=true;b.style.display='';const x=.66,z=1.3+Math.sin(t*1.7)*.07;LAI.position.set(x,-.55,z);LAI.rotation.z=Math.sin(t*.9)*.25;aiSpin(LAI.children[0],t);
 const dt=Math.min(.05,t-(AIB.lt||t));AIB.lt=t;if(AIB.t>0){AIB.t-=dt;if(AIB.t<=0)b.lastChild.style.display='none'}else{AIB.next-=dt;if(AIB.next<=0){AIB.next=AIB.q.length?.5:13+Math.random()*7;aiLobbySay(AIB.q.length?AIB.q.shift():aiPick('lobby'))}}
 const v=new THREE.Vector3(x,-.55,z+.1).project(LC);b.style.left=((v.x+1)/2*100)+'%';b.style.top=((1-v.y)/2*100)+'%'}
/* 광장: AI가 하늘에 떠서 돌아다니며 생중계 */
function aiPlazaAdd(){if(!PZ||PZ.ai||!aiMascotGet())return;const w=new THREE.Group(),m=aiMascotMesh();m.rotation.x=-.55;w.add(m);w.scale.setScalar(.75);PZ.sc.add(w);w.userData.b={id:'ai'};
 const el=document.createElement('div');el.className='pb';el.innerHTML='<div class="bb" style="display:none"></div><div class="pn ai">📢 AI 기자</div>';$('plo').append(el);
 const b={m:w,el,bb:el.firstChild,name:'📢 AI',me:0,ai:1,air:1,x:2.5,y:1.5,tx:0,ty:0,wait:2,say:0,ph:0,nt:2.5};PZ.b.push(b);PZ.ai=b}
/* 결과 화면: AI 기자의 한마디 */
function aiEnd(win){const e=$('ew');if(!e||!S||S.sim)return;const k=win===null?'spec':win?(SV.wins===1?'first':'win'):'lose';const d=document.createElement('div');d.className='aiend';d.innerHTML='<img src="assets/ui/ai.png" alt="AI"><p></p>';d.lastChild.textContent=aiPick(k);e.prepend(d)}
// ---------- 🐥 게임 속 미니 영웅(롤토체스 꼬마 전설이처럼): 판 주인은 왼쪽 아래, 정찰 온 영웅은 왼쪽 위로 걸어 들어와요 ----------
function heroRand(){const P=heroPool(),u=P[Math.floor(Math.random()*P.length)];return{id:u.id}}
function heroSafe(h){/* 온라인으로 받은 영웅 설정 검사 */if(!h||!heroValid(h.id))return heroRand();return{id:h.id}}
const HB=new Map();
function heroReset(){HB.forEach(e=>{if(e.m&&e.m.parent)e.m.parent.remove(e.m);if(e.tag&&e.tag.parent)e.tag.parent.remove(e.tag)});HB.clear()}
{const st2=start;start=function(gs,p0h){const r=st2.apply(this,arguments);if(!gs&&S){heroReset();S.pl.forEach((p,i)=>{p.hero=i===0?Object.assign({},SV.hero):heroRand();p.vt=15+Math.random()*40})}return r}}
/* v판을 지금 구경 중인 다른 플레이어들(나·온라인 손님·가끔 놀러 가는 AI) */
function visitorsOf(v){if(!S)return[];if(S.net==='guest')return(S.vz||[]).filter(i=>i!==v);const L=[];
 if(view===v&&v!==0)L.push(0);
 if(S.net==='host'&&typeof NET!=='undefined'){const st=NET._st;Object.keys(st.slot2cid||{}).forEach(k=>{const i=+k;if(i!==v&&st.gview[i]===v&&!L.includes(i))L.push(i)})}
 S.pl.forEach((p,i)=>{if(p.ai&&p.alive&&p.visit&&p.visit.b===v&&S.t<p.visit.t&&i!==v&&!L.includes(i))L.push(i)});return L.slice(0,4)}
function tagTex(txt){const c=document.createElement('canvas'),g=c.getContext('2d');c.width=160;c.height=44;g.font='bold 26px "Jua",sans-serif';const w=Math.min(156,g.measureText(txt).width+18);
 g.fillStyle='#1a0f33dd';g.beginPath();g.roundRect?g.roundRect((160-w)/2,4,w,36,12):g.rect((160-w)/2,4,w,36);g.fill();g.fillStyle='#fde047';g.textAlign='center';g.textBaseline='middle';g.fillText(txt,80,23);
 const t=new THREE.CanvasTexture(c);return t}
function heroBoard(dt){if(!S||!Sc||!S.pl)return;
 /* AI는 30~90초마다 아무 판에나 5초 놀러 가요(방장·혼자 할 때만 계산, 손님은 방장이 보내 준 걸 그려요) */
 if(S.net!=='guest'&&S.cdn<=0)S.pl.forEach((p,i)=>{if(!p.ai||!p.alive)return;p.vt=(p.vt??30)-dt;if(p.vt<=0){p.vt=30+Math.random()*60;const o=S.pl.filter(q=>q.alive&&q.id!==i);if(o.length)p.visit={b:o[Math.floor(Math.random()*o.length)].id,t:S.t+5}}});
 const v=view,want=[[v,1]].concat(visitorsOf(v).map(i=>[i,0])),seen=new Set(),HX=.5;let vk=0;
 for(const[i,home]of want){const p=S.pl[i];if(!p||!p.hero||(home&&!p.alive))continue;const hid=p.hero.id;if(HGLB[hid])hglbGet(hid);/* 3D 영웅은 불러오기가 끝나면 다시 만들어 진짜 모델로 */const key=JSON.stringify(p.hero)+(HG[hid]&&HG[hid].st==='ok'?'g':'');let e=HB.get(i);
  if(!e||e.key!==key){if(e&&e.m)Sc.remove(e.m);const h=heroMesh(p.hero);h.rotation.x=-.75;/* 위에서 보는 카메라 쪽으로 기울여 얼굴이 보이게 */const m=new THREE.Group();m.add(h);m.scale.setScalar(1.3);m.traverse(o=>{o.renderOrder=30});Sc.add(m);e={m,h,key,tag:e&&e.tag,shown:0};HB.set(i,e)}
  const tx=HX+(home?0:vk%2*.0),ty=home?BH-cellY(ROWS-2)+.1:BH-cellY(1.4)-vk*1.5;if(!home)vk++;
  if(!e.shown||e.home!==home||e.v!==v){e.x=tx;e.y=home?ty:BH+1.2;e.home=home;e.v=v}
  const dx=tx-e.x,dy=ty-e.y,d=Math.hypot(dx,dy),walk=d>.04;if(walk){const k=Math.min(1,dt*3.2/d);e.x+=dx*k;e.y+=dy*k;e.m.rotation.z=Math.atan2(dx,-dy)}else e.m.rotation.z+=(0-e.m.rotation.z)*Math.min(1,dt*6);
  e.m.position.set(e.x,e.y,walk?Math.abs(Math.sin(S.t*12+i))*.05:0);e.m.visible=true;birdAnim(e.h,S.t+i,walk);
  if(!home){const lbl=i===0?'👀 나':`👀 ${(i+S.off)%8+1}번`;if(!e.tag||e.tagTxt!==lbl){if(e.tag)Sc.remove(e.tag);e.tag=new THREE.Sprite(new THREE.SpriteMaterial({map:tagTex(lbl),transparent:true,depthTest:false}));e.tag.scale.set(1.6,.44,1);e.tag.renderOrder=46;e.tagTxt=lbl;Sc.add(e.tag)}
   e.tag.visible=true;e.tag.position.set(e.x,e.y+.1,1.55);e.tag.scale.x=1.6/(Sc.scale.x||1)}else if(e.tag)e.tag.visible=false;
  e.shown=1;seen.add(i)}
 HB.forEach((e,i)=>{if(!seen.has(i)){if(e.m)e.m.visible=false;if(e.tag)e.tag.visible=false;e.shown=0}})}
if(/[?&]reset=1/.test(location.search)){try{localStorage.removeItem(SAVE_KEY)}catch(e){}location.replace(location.pathname)}
{const b=document.createElement('button');b.textContent='📘 튜토리얼 다시 보기';b.className='tutre';b.onclick=()=>{SV.tut=0;svSave();toast('📘 다음 판을 시작할 때 튜토리얼이 다시 나와요')};const tb=document.querySelector('#tipm .tipb');if(tb)tb.prepend(b)}

// ---------- ✨ PFX: 코드로 그리는 픽셀 이펙트 (pixelfx 방식 참고, 직접 구현) ----------
// 작은 캔버스에 한 점씩 그려 NearestFilter 스프라이트로 띄워요. 효과마다 draw(g,t) 하나. 스킬 이펙트 시제품: 플라즈마 낙뢰
const PFX=(()=>{const L=[],Q=[];
 const pal=['#2b1055','#4c1d95','#7c3aed','#60a5fa','#a5f3fc','#fef08a','#ffffff'],SPK=['#7c2d12','#ea580c','#fb923c','#fde68a','#ffffff'];
 const FL=[1,.7,.25,.95,.45,.85,.2,.6];
 function spawn(W,H,ox,oy,dur,draw,x,y,z,wu){if(typeof Sc==='undefined'||!Sc)return;const cv=document.createElement('canvas');cv.width=W;cv.height=H;const g=cv.getContext('2d');
  const tx=new THREE.CanvasTexture(cv);tx.magFilter=tx.minFilter=THREE.NearestFilter;tx.generateMipmaps=false;
  const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:tx,transparent:true,depthWrite:false,depthTest:false}));sp.center.set(ox/W,1-oy/H);sp.scale.set(wu,wu*H/W,1);sp.position.set(x,y,z);sp.renderOrder=40;Sc.add(sp);
  L.push({sp,g,tx,W,H,t:0,dur,draw,st:{}})}
 // 지그재그 번개 줄기(위→아래), 가지 2~3개
 function bolt(g,st,W,H,ox,oy,seed){const R=k=>{const v=Math.sin(seed*91.7+k*12.9898)*43758.5453;return v-Math.floor(v)},pts=[];let x=ox+ (R(1)-.5)*10;
  for(let i=0;i<=12;i++){const yy=Math.round(i*oy/12);if(i>0&&i<12)x+=(R(i+2)-.5)*9;else if(i===12)x=ox;pts.push([Math.round(x),yy])}return pts}
 function line(g,a,b,c,w){const dx=b[0]-a[0],dy=b[1]-a[1],n=Math.max(Math.abs(dx),Math.abs(dy))||1;g.fillStyle=c;for(let i=0;i<=n;i++){const x=Math.round(a[0]+dx*i/n),y=Math.round(a[1]+dy*i/n);g.fillRect(x-(w>>1),y,w,1)}}
 function strike(x,y,z,delay){Q.push({x,y,z,at:delay})}
 function drawStrike(g,t,W,H,st){const ox=24,oy=86;if(!st.s){st.s=Math.random()*100;st.sp=[];st.br=[]}
  // 0~.16 바닥 마법진(점선 고리가 그려지며 빛남)
  if(t<.5){const rev=Math.min(1,t/.16),fade=t<.2?1:Math.max(0,1-(t-.2)/.3);g.globalAlpha=fade;for(let i=0;i<20;i++){if(i/20>rev)continue;const a=i/20*6.283+t*3;g.fillStyle=t>.16&&t<.24?pal[6]:pal[i%2?4:3];g.fillRect(Math.round(ox+Math.cos(a)*14),Math.round(oy+Math.sin(a)*4),2,1)}g.globalAlpha=1}
  // .16~ 내리치기: 깜박이는 굵은 줄기 + 가지, 시간이 지나면 보라로 식음
  const s0=.16;if(t>=s0&&t<.62){const k=t-s0,f=FL[Math.min(FL.length-1,Math.floor(k*26))]*(k<.3?1:Math.max(0,1-(k-.3)/.16)),reroll=Math.floor(k*20);
   const pts=bolt(g,st,W,H,ox,oy,st.s+reroll*.37),lead=k<.05?Math.floor(k/.05*12):12;
   g.globalAlpha=Math.min(1,.35+f);for(let i=0;i<lead;i++)line(g,pts[i],pts[i+1],k>.3?pal[2]:pal[3],5);
   for(let i=0;i<lead;i++)line(g,pts[i],pts[i+1],k>.3?pal[3]:pal[5],3);
   if(f>.4)for(let i=0;i<lead;i++)line(g,pts[i],pts[i+1],pal[6],1);
   if(k>.05&&k<.3)[3,6,8].forEach((j,n)=>{const a=pts[j],b=[a[0]+(n%2?9:-9),a[1]+7],c=[b[0]+(n%2?4:-4),b[1]+6];line(g,a,b,pal[4],1);line(g,b,c,pal[3],1)});
   if(k<.12){g.globalAlpha=.55*(1-k/.12);g.fillStyle=pal[6];g.fillRect(ox-9,oy-6,19,8);g.fillStyle=pal[5];g.fillRect(ox-14,oy-3,29,4)}
   g.globalAlpha=1}
  // 맞는 순간 불꽃 튀김(플라즈마라 주황 불똥 섞임) + 그을음
  if(t>=s0&&!st.boom){st.boom=1;for(let i=0;i<22;i++){const a=Math.PI+Math.random()*Math.PI,v=20+Math.random()*45;st.sp.push({x:ox,y:oy-1,vx:Math.cos(a)*v,vy:Math.sin(a)*v*.8,l:.3+Math.random()*.45,c:Math.random()<.5?SPK:pal})}}
  const dt=1/60;st.sp.forEach(p=>{if(p.l<=0)return;p.l-=dt;p.vy+=160*dt;p.x+=p.vx*dt;p.y+=p.vy*dt;if(p.y>oy+2){p.y=oy+2;p.vy*=-.35;p.vx*=.6}const c=p.c[Math.max(0,Math.min(p.c.length-1,Math.floor(p.l*9)))];g.fillStyle=c;g.fillRect(Math.round(p.x),Math.round(p.y),1,1)});
  if(t>=s0){const a=Math.max(0,1-(t-s0)/1.1);g.globalAlpha=.75*a;g.fillStyle='#1c1917';g.fillRect(ox-8,oy-1,17,3);g.fillRect(ox-5,oy-2,11,5);g.fillStyle=SPK[1];g.globalAlpha=a*(t<.5?1:.4);g.fillRect(ox-2,oy-1,5,2);g.globalAlpha=1}}
 // ── 미리 그린 프레임 시트: 효과 종류×변형 3개를 한 번만 그리고, 인스턴스는 UV만 바꿔 재생(새가 많아도 가벼움)
 const SH={};const rngOf=sd=>{let a=sd*2654435761>>>0;return()=>{a=(a+0x6D2B79F5)>>>0;let t=a;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296}};
 const px=(g,x,y,c,a)=>{g.globalAlpha=a??1;g.fillStyle=c;g.fillRect(Math.round(x),Math.round(y),1,1)},disc=(g,cx,cy,r,c,a)=>{g.globalAlpha=a??1;g.fillStyle=c;for(let y=-r;y<=r;y++){const w=Math.floor(Math.sqrt(Math.max(0,r*r-y*y)));g.fillRect(Math.round(cx-w),Math.round(cy+y),w*2+1,1)}};
 const ln=(g,x0,y0,x1,y1,c,a)=>{const n=Math.max(Math.abs(x1-x0),Math.abs(y1-y0))||1;for(let i=0;i<=n;i++)px(g,x0+(x1-x0)*i/n,y0+(y1-y0)*i/n,c,a)};
 const C={steam:['#64748b','#94a3b8','#cbd5e1','#f1f5f9','#ffffff'],fire:['#450a0a','#b91c1c','#ea580c','#f59e0b','#fde68a','#ffffff'],gfire:['#052e16','#15803d','#22c55e','#86efac','#ecfccb','#ffffff'],
  ice:['#0c4a6e','#0284c7','#38bdf8','#a5f3fc','#ecfeff','#ffffff'],snow:['#64748b','#bae6fd','#e0f2fe','#ffffff'],poi:['#3b0764','#7e22ce','#a855f7','#e9d5ff'],volt:['#14532d','#16a34a','#84cc16','#d9f99d','#ffffff'],wind:['#0e7490','#22d3ee','#a5f3fc','#ffffff'],fog:['#2e1065','#4c1d95','#6d28d9','#4d7c0f','#65a30d']};
 const FX={
  steam:{W:40,H:56,ox:20,oy:52,N:18,fps:20,wu:1.25,d(g,t,R){const P=C.steam;for(let i=0;i<7;i++){const t0=i*.055,k=(t-t0)/.65;if(k<0||k>1)continue;const x=20+(R[i]-.5)*12+Math.sin(k*6+i)*2,y=50-k*42,r=2+k*7;disc(g,x,y,Math.round(r),P[Math.min(4,1+Math.floor((1-k)*4))],.85*(1-k*k));disc(g,x-1,y-1,Math.max(1,Math.round(r*.55)),P[4],.7*(1-k))}
   if(t<.45)for(let i=0;i<6;i++){const a=-Math.PI*(.15+.7*R[10+i]),v=26+R[20+i]*20;px(g,20+Math.cos(a)*v*t,48+Math.sin(a)*v*t+70*t*t,'#7dd3fc',1-t/.45)}}},
  fire:{W:40,H:60,ox:20,oy:56,N:20,fps:20,wu:1.25,d(g,t,R,P0){const P=P0||C.fire,env=t<.15?t/.15:t>.75?Math.max(0,1-(t-.75)/.25):1;for(let x=-9;x<=9;x++){const h=Math.max(0,(16+R[(x+9)%20]*14-Math.abs(x)*1.2)*env*(.8+.25*Math.sin(t*22+x*1.7+R[0]*9)));for(let y=0;y<h;y++){const f=y/Math.max(1,h),ci=f>.85?1:f>.6?2:f>.35?3:f>.15?4:5;if(Math.abs(x)>3&&ci>4)continue;px(g,20+x,55-y,P[Math.min(5,ci)],1)}}
   for(let i=0;i<5;i++){const k=((t*1.6+R[30+i])%1);px(g,20+(R[40+i]-.5)*14,52-k*40,P[3+(i%2)],(1-k)*env)}}},
  gfire:{W:40,H:60,ox:20,oy:56,N:20,fps:20,wu:1.25,d(g,t,R){FX.fire.d(g,t,R,C.gfire);if(t>.25&&t<.9){const k=(t-.25)/.65,y=Math.round(30-k*18),x=17;['.###.','#.#.#','#####','.#.#.'].forEach((r,j)=>[...r].forEach((c,i)=>{if(c==='#')px(g,x+i,y+j,'#ecfccb',1-k*.6)}))}}},
  ice:{W:40,H:56,ox:20,oy:50,N:20,fps:20,wu:1.5,d(g,t,R){const P=C.ice;if(t<.72){const gr=Math.min(1,t/.22);for(let i=0;i<7;i++){const a=-Math.PI/2+(i-3)*.42+(R[i]-.5)*.2,L=(10+R[10+i]*16)*gr,x1=20+Math.cos(a)*L,y1=48+Math.sin(a)*L;ln(g,20,48,x1,y1,P[2]);ln(g,21,48,x1+1,y1,P[3]);px(g,x1,y1,P[5])}disc(g,20,46,Math.round(5*gr),P[4],.55)}
   else{const k=(t-.72)/.28;for(let i=0;i<16;i++){const a=R[20+i]*6.283,v=8+R[40+i]*16;px(g,20+Math.cos(a)*v*k*1.4,40+Math.sin(a)*v*k+30*k*k,P[3+(i%3)],1-k)}}}},
  snow:{W:40,H:64,ox:20,oy:58,N:20,fps:20,wu:2,d(g,t,R){const P=C.snow,T=.32;if(t<T){const y=4+(t/T)*48;disc(g,20,y,5,P[1]);disc(g,19,y-1,4,P[3]);for(let i=1;i<4;i++)px(g,20+(R[i]-.5)*4,y-6-i*3,P[2],.6)}else{const k=(t-T)/(1-T);disc(g,20,55,Math.round(4+k*9),P[3],.55*(1-k));for(let i=0;i<18;i++){const a=-Math.PI*R[i],v=14+R[20+i]*26;px(g,20+Math.cos(a)*v*k,55+Math.sin(a)*v*k+40*k*k,P[2+(i%2)],1-k)}disc(g,20,57,Math.round(6*(1-k*.5)),P[3],.8*(1-k))}}},
  cage:{W:40,H:60,ox:20,oy:56,N:22,fps:20,wu:1.25,d(g,t,R){const P=C.ice,Q=C.poi,dn=Math.min(1,t/.2),fd=t>.8?1-(t-.8)/.3:1;for(let i=0;i<5;i++){const x=8+i*6,L=Math.round(48*dn);for(let y=0;y<L;y++){px(g,x,8+y,P[2],fd);px(g,x+1,8+y,P[4],fd)}}if(dn>=1){ln(g,6,8,34,8,P[3],fd);ln(g,6,55,34,55,P[3],fd)}
   for(let i=0;i<5;i++){const k=((t*1.3+R[i])%1);px(g,11+i*5,12+k*40,Q[2],fd);px(g,11+i*5,13+k*40,Q[3],fd*.7)}}},
  zap:{W:40,H:48,ox:20,oy:40,N:16,fps:20,wu:1.5,d(g,t,R){const P=C.volt,f=[1,.5,.9,.3,1,.6,.2,.8][Math.floor(t*16)%8]*(t>.5?Math.max(0,1-(t-.5)/.3):1),rr=rngOf(Math.floor(t*16)+Math.floor(R[0]*999));for(let b=0;b<5;b++){let x=20,y=26,a=rr()*6.283;for(let s=0;s<6;s++){const nx=x+Math.cos(a)*3+(rr()-.5)*3,ny=y+Math.sin(a)*3+(rr()-.5)*3;ln(g,x,y,nx,ny,s<2?P[4]:P[2+(s%2)],f);x=nx;y=ny}}disc(g,20,26,3,P[3],.5*f)}},
  wind:{W:48,H:48,ox:24,oy:40,N:24,fps:20,wu:2.3,d(g,t,R){const P=C.wind,fd=Math.min(1,t<.15?t/.15:t>.85?(1.2-t)/.35:1);for(let r=0;r<3;r++){const z=36-r*9-t*6,rx=12+r*3,ry=4+r;for(let i=0;i<26;i++){const a=i/26*6.283+t*(9+r*3)+r;if(Math.sin(a)<-.2&&i%2)continue;px(g,24+Math.cos(a)*rx,z+Math.sin(a)*ry,P[(i+r)%4],fd*(Math.sin(a)>0?1:.5))}}}},
  chomp:{W:44,H:44,ox:22,oy:36,N:36,fps:20,wu:1.45,d(g,t,R){const G1='#3f6212',G2='#65a30d',G3='#a3e635',RD='#be123c',PK='#fb7185',W='#ffffff',cl=t<.12?t/.12:1,ch=t<.12?0:Math.abs(Math.sin((t-.12)*14))*.25,o=(1-cl)*12+ch*5,fd=t>1.6?Math.max(0,1-(t-1.6)/.2):1;
   const jaw=(dir)=>{const cy=22+dir*(2+o);for(let x=-14;x<=14;x++){const hh=Math.round(Math.sqrt(Math.max(0,1-(x/14.5)**2))*9);for(let k=0;k<hh;k++){const yy=cy+dir*k;g.globalAlpha=fd;g.fillStyle=k<2?RD:k<4?PK:k>hh-3?G1:k>hh-5?G2:G3;if(k<2&&dir>0)g.fillStyle=RD;g.fillRect(22+x,yy,1,1)}}
    for(let i=-12;i<=12;i+=4){g.globalAlpha=fd;g.fillStyle=W;for(let k=0;k<3;k++)g.fillRect(22+i,cy-dir*(k+1),1,1)}
    if(dir<0){g.fillStyle='#111';g.fillRect(16,cy-9,2,2);g.fillRect(27,cy-9,2,2);g.fillStyle=W;g.fillRect(16,cy-10,1,1);g.fillRect(27,cy-10,1,1)}};
   jaw(-1);jaw(1);if(t>.12&&t<1.6)for(let i=0;i<3;i++){const k=((t*2+R[i])%1);g.globalAlpha=(1-k)*fd;g.fillStyle=G3;g.fillRect(14+i*8,22-k*14,1,1)}g.globalAlpha=1}},
  fog:{W:64,H:40,ox:32,oy:20,N:24,fps:16,wu:3.4,d(g,t,R){const P=C.fog,e=t<.25?t/.25:t>.7?Math.max(0,1-(t-.7)/.8):1;for(let i=0;i<9;i++){const x=10+R[i]*44+Math.sin(t*3+i)*3,y=12+R[10+i]*16,r=Math.round((5+R[20+i]*6)*(.7+.3*e));disc(g,x,y,r,P[i%5],.5*e)}}}};
 function sheet(k,v){const key=k+v;if(SH[key])return SH[key];const f=FX[k],cols=8,rows=Math.ceil(f.N/cols),cv=document.createElement('canvas');cv.width=f.W*cols;cv.height=f.H*rows;const g=cv.getContext('2d'),R=[],rr=rngOf(k.length*131+v*977+7);for(let i=0;i<64;i++)R.push(rr());
  for(let n=0;n<f.N;n++){g.save();g.translate((n%cols)*f.W,Math.floor(n/cols)*f.H);g.beginPath();g.rect(0,0,f.W,f.H);g.clip();f.d(g,n/f.fps,R);g.restore()}g.globalAlpha=1;
  const tx=new THREE.CanvasTexture(cv);tx.magFilter=tx.minFilter=THREE.NearestFilter;tx.generateMipmaps=false;return SH[key]={tx,cols,rows}}
 const PL=[],PQ=[];
 function play(k,x,y,z,delay,sc,dur){if(!FX[k])return;PQ.push({k,x,y,z,at:delay||0,sc:sc||1,dur})}
 function start(q){if(typeof Sc==='undefined'||!Sc)return;const f=FX[q.k],sh=sheet(q.k,(Math.random()*3)|0),tx=sh.tx.clone();tx.needsUpdate=true;tx.repeat.set(1/sh.cols,1/sh.rows);tx.offset.set(0,1-1/sh.rows);
  const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:tx,transparent:true,depthWrite:false,depthTest:false}));sp.center.set(f.ox/f.W,1-f.oy/f.H);const w=f.wu*q.sc;sp.scale.set(w,w*f.H/f.W,1);sp.position.set(q.x,q.y,q.z);sp.renderOrder=40;Sc.add(sp);PL.push({sp,tx,f,sh,t:0,dur:q.dur})}
 // 여러 새에게: 최대 14마리만 골라 순서대로(성능), 공중 새는 높이 1.2
 function many(k,units,gap){[...units].sort(()=>Math.random()-.5).slice(0,14).forEach((u,i)=>play(k,u.x,BH-u.y,u.bp.t==='A'?1.2:0,i*(gap??.05)))}
 function towers(k,p){let i=0;p.grid.forEach((row,y)=>row.forEach((t,x)=>{if(t&&t.bp.id!=='wall'&&i<16)play(k,cellX(x,y),BH-cellY(y),0,(i++)*.04)}))}
 function board(k,n){for(let i=0;i<n;i++)play(k,.3+Math.random()*(COLS-.6),.5+Math.random()*(BH-1),.3,i*.06)}
 function update(dt){for(let i=Q.length-1;i>=0;i--){const q=Q[i];q.at-=dt;if(q.at<=0){Q.splice(i,1);spawn(48,92,24,86,1.35,drawStrike,q.x,q.y,q.z,1.7)}}
  for(let i=PQ.length-1;i>=0;i--){const q=PQ[i];q.at-=dt;if(q.at<=0){PQ.splice(i,1);start(q)}}
  for(let i=PL.length-1;i>=0;i--){const e=PL[i];e.t+=dt;const n=Math.floor(e.t*e.f.fps);if(n>=e.f.N||(e.dur&&e.t>=e.dur)){Sc.remove(e.sp);e.tx.dispose();e.sp.material.dispose();PL.splice(i,1);continue}
   e.tx.offset.set((n%e.sh.cols)/e.sh.cols,1-(Math.floor(n/e.sh.cols)+1)/e.sh.rows)}
  for(let i=L.length-1;i>=0;i--){const e=L[i];e.t+=dt;if(e.t>=e.dur){Sc.remove(e.sp);e.sp.material.map.dispose();e.sp.material.dispose();L.splice(i,1);continue}
   e.g.clearRect(0,0,e.W,e.H);e.draw(e.g,e.t,e.W,e.H,e.st);e.tx.needsUpdate=true}}
 return {strike,play,many,towers,board,update,FX,n:()=>L.length+Q.length+PL.length+PQ.length}})();


// ---------- 🗞 뉴스새 'AI' (NPC 마스코트·조류 인플루언서): 드론 메카 병아리 ----------
// 노란 병아리가 회색 메카 슈트를 입고 프로펠러 4개로 날아요. 헬멧 위 빨강·파랑 사이렌 + 카메라 렌즈 + 헤드셋. 피해 배수가 바뀔 때 현수막을 끌고 날아가요
function mechaChickMesh(){const g=new THREE.Group(),Y=0xffd23f,GY=0xd5dbe2,DG=0x6b7280,DK=0x1f2937,at=(m,x,y,z,s,p)=>{m.position.set(x,y,z);if(s)m.scale.set(s[0],s[1],s[2]);(p||g).add(m);return m};
 const body=new THREE.Group();g.add(body);const ab=(m,x,y,z,s)=>at(m,x,y,z,s,body),met={metalness:.45,roughness:.38};
 // 메카 슈트(둥근 몸통) + 가슴 패널 + 'AI' 불빛
 ab(SP(.34,GY,met),0,0,0,[1,1,.92]);ab(SP(.2,DG,met),0,-.27,-.04,[1,.4,.9]);ab(SP(.06,0x22d3ee,{emissive:0x22d3ee,emissiveIntensity:1}),0,-.335,-.02,[1,.4,1]);
 [-1,1].forEach(s=>{ab(SP(.12,DG,met),s*.3,-.02,.02,[.8,.9,.8]);ab(SP(.1,Y),s*.37,.03,-.05,[.5,.9,.7])});// 어깨 장갑 + 삐져나온 노란 날개
 // 노란 병아리 얼굴(슈트 앞 창으로 쏙)
 ab(SP(.27,Y),0,-.2,.2);[-1,1].forEach(s=>{ab(SP(.052,0x111111),s*.1,-.44,.25);ab(SP(.018,0xffffff),s*.085,-.485,.275);ab(SP(.045,0xf9a8d4),s*.18,-.41,.15,[1,.4,.7])});
 const bk=KO(.06,.12,0xf97316);bk.rotation.x=PI/2;bk.rotation.z=PI;ab(bk,0,-.5,.16);
 // 헬멧(뒤·위를 감싸는 반구) + 카메라 렌즈 + 사이렌
 const hm=new THREE.Mesh(new THREE.SphereGeometry(.3,22,12,0,PI*2,0,PI*.5),new THREE.MeshStandardMaterial(Object.assign({color:GY},met)));hm.rotation.x=PI/2-.45;ab(hm,0,-.13,.25);
 ab(CY(.06,.06,.05,DK),0,-.33,.47).rotation.x=PI/2+.6;ab(SP(.045,0x1e3a8a,{metalness:.2,roughness:.1}),0,-.36,.48);
 ab(CY(.06,.07,.05,DK),0,-.1,.55);const sir=new THREE.Group();sir.position.set(0,-.1,.61);body.add(sir);
 const sR=new THREE.MeshStandardMaterial({color:0xef4444,emissive:0xef4444,emissiveIntensity:1.2,roughness:.3}),sB=new THREE.MeshStandardMaterial({color:0x3b82f6,emissive:0x3b82f6,emissiveIntensity:.2,roughness:.3});
 const hR=new THREE.Mesh(new THREE.SphereGeometry(.075,16,10,0,PI,0,PI/2),sR),hB=new THREE.Mesh(new THREE.SphereGeometry(.075,16,10,PI,PI,0,PI/2),sB);hR.rotation.x=hB.rotation.x=PI/2;sir.add(hR,hB);
 const glow=new THREE.Sprite(new THREE.SpriteMaterial({map:glowTex(),color:0xff4d4d,transparent:true,opacity:.9,depthWrite:false,blending:THREE.AdditiveBlending}));glow.scale.set(.7,.7,1);sir.add(glow);
 // 헤드셋 마이크
 ab(SP(.05,DK),.27,-.2,.2);const mic=CY(.01,.01,.16,DK);ab(mic,.23,-.34,.12).rotation.x=1.1;ab(SP(.028,0x22d3ee),.17,-.45,.08);
 // 🚁 프로펠러 4개(등에서 뻗은 팔 + 모터 + 날개깃)
 const rot=[];[[1,1],[-1,1],[1,-1],[-1,-1]].forEach(([sx,sy])=>{const arm=BX(.42,.05,.05,DG,met);arm.rotation.z=Math.atan2(sy*.5,sx*.5);ab(arm,sx*.27,sy*.16+.12,.36);
  ab(CY(.06,.06,.1,DK,met),sx*.45,sy*.28+.12,.4);const P=new THREE.Group();P.position.set(sx*.45,sy*.28+.12,.47);body.add(P);[0,1].forEach(k=>{const bl=BX(.5,.045,.01,0x374151);bl.rotation.z=k*PI/2;P.add(bl)});rot.push(P)});
 // 짧은 메카 다리
 [-1,1].forEach(s=>{ab(CY(.06,.06,.16,DG,met),s*.13,.02,-.32);ab(BX(.13,.18,.05,DK,met),s*.13,-.04,-.41)});
 g.userData={wings:[],rot,sir,sR,sB,glow,body};return g}
let GLOWT=null;function glowTex(){if(GLOWT)return GLOWT;const cv=document.createElement('canvas');cv.width=cv.height=64;const x=cv.getContext('2d'),gr=x.createRadialGradient(32,32,0,32,32,32);gr.addColorStop(0,'rgba(255,255,255,1)');gr.addColorStop(.35,'rgba(255,255,255,.55)');gr.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=gr;x.fillRect(0,0,64,64);return GLOWT=new THREE.CanvasTexture(cv)}
function bannerTex(txt){const cv=document.createElement('canvas');cv.width=640;cv.height=150;const x=cv.getContext('2d');
 x.fillStyle='#140b33';x.beginPath();x.roundRect?x.roundRect(6,6,628,138,26):x.rect(6,6,628,138);x.fill();x.fillStyle='#ffd43b';x.beginPath();x.roundRect?x.roundRect(14,14,612,122,20):x.rect(14,14,612,122);x.fill();
 for(let i=-2;i<18;i++){x.fillStyle=i%2?'#140b33':'#ffd43b';x.beginPath();x.moveTo(14+i*40,14);x.lineTo(34+i*40,14);x.lineTo(14+i*40,34);x.fill()}
 x.fillStyle='#dc2626';x.fillRect(14,100,612,36);x.fillStyle='#fff';x.font='900 26px Jua, "Black Han Sans", sans-serif';x.textAlign='center';x.fillText('📢 AI 속보 · 짹짹 뉴스',320,128);
 x.fillStyle='#140b33';let fs=50;do{x.font=`400 ${fs}px "Black Han Sans", Jua, sans-serif`;fs-=2}while(x.measureText(txt).width>580&&fs>22);x.fillText(txt,320,82);
 const t=new THREE.CanvasTexture(cv);t.minFilter=THREE.LinearFilter;return t}
// 🐣 마스코트 정식 3D(Hyper3D Rodin → assets/models/ai_mascot.glb, 341면·52KB). 불러오면 이걸 쓰고, 그 전엔 코드 모델
let AIM=null,AIMst=0;function aiMascotGet(){if(AIMst===0&&THREE.GLTFLoader){AIMst=1;new THREE.GLTFLoader().load('assets/models/ai_mascot.glb',g=>{const sc=g.scene;sc.rotation.x=PI/2;sc.updateMatrixWorld(true);const bx=new THREE.Box3().setFromObject(sc),k=1.25/Math.max(.01,bx.max.z-bx.min.z);sc.scale.setScalar(k);sc.position.z=-bx.min.z*k-.62;
  sc.traverse(o=>{if(o.isMesh){const t=o.material.map||o.material.emissiveMap;if(t)t.encoding=THREE.LinearEncoding;o.material=new THREE.MeshBasicMaterial({map:t});o.geometry.userData.cached=true}});AIM=sc;AIMst=2},null,()=>{AIMst=3})}return AIMst===2?AIM:null}
let BLURT=null;function blurTex(){if(BLURT)return BLURT;const cv=document.createElement('canvas');cv.width=cv.height=64;const x=cv.getContext('2d');x.translate(32,32);for(let i=0;i<2;i++){x.rotate(PI/2);const gr=x.createLinearGradient(-30,0,30,0);gr.addColorStop(0,'rgba(255,255,255,0)');gr.addColorStop(.5,'rgba(230,236,245,.75)');gr.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=gr;x.beginPath();x.ellipse(0,0,30,5,0,0,PI*2);x.fill()}
 x.globalAlpha=.25;x.fillStyle='#e5e7eb';x.beginPath();x.arc(0,0,28,0,PI*2);x.fill();return BLURT=new THREE.CanvasTexture(cv)}
function aiMascotMesh(){const src=aiMascotGet();if(!src)return mechaChickMesh();const g=new THREE.Group(),body=new THREE.Group();g.add(body);body.add(src.clone(true));
 // 사이렌 빛 + 프로펠러 4개 위치에 도는 잔상(모델의 프로펠러는 고정이라)
 const sir=new THREE.Group();sir.position.set(0,0,.6);body.add(sir);const sR={emissiveIntensity:0},sB={emissiveIntensity:0};
 const glow=new THREE.Sprite(new THREE.SpriteMaterial({map:glowTex(),color:0xff4d4d,transparent:true,opacity:.95,depthWrite:false,blending:THREE.AdditiveBlending}));glow.scale.set(.75,.75,1);sir.add(glow);
 const rot=[[-.48,.38],[.48,.38],[-.72,.12],[.72,.12]].map(([x,z])=>{const s=new THREE.Sprite(new THREE.SpriteMaterial({map:blurTex(),transparent:true,depthWrite:false,opacity:.85}));s.scale.set(.5,.5,1);s.position.set(x,-.05,z);body.add(s);return {rotation:{set z(v){s.material.rotation=v}}}});// newsUpd가 r.rotation.z=… 로 돌려요
 g.userData={wings:[],rot,sir,sR,sB,glow,body};return g}
let NEWS=null;
if(typeof start==='function'){const _st=start;start=function(){const r=_st.apply(this,arguments);try{if(!S.sim)aiMascotGet()}catch(e){}return r}}
function newsBird(txt){if(typeof Sc==='undefined'||!Sc)return;if(NEWS)newsEnd();const m=aiMascotMesh();m.scale.setScalar(1.75);m.rotation.x=-1.05;/* 위에서 보는 카메라 쪽으로 얼굴을 돌려 '화면을 보며' 날아가요 */Sc.add(m);
 const bn=new THREE.Sprite(new THREE.SpriteMaterial({map:bannerTex(txt),transparent:true,depthTest:false,depthWrite:false}));bn.scale.set(5.2,1.22,1);bn.renderOrder=45;Sc.add(bn);
 const rope=new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(),new THREE.Vector3()]),new THREE.LineBasicMaterial({color:0x111827}));Sc.add(rope);
 const W=typeof COLS!=='undefined'?COLS:8;NEWS={m,bn,rope,t:0,dur:6,x0:-2.5,x1:W+7.5,y:BH*.6};m.traverse(o=>{o.renderOrder=44});
}
function newsEnd(){if(!NEWS)return;[NEWS.m,NEWS.bn,NEWS.rope].forEach(o=>Sc.remove(o));NEWS.bn.material.map.dispose();NEWS.bn.material.dispose();NEWS.rope.geometry.dispose();NEWS=null}
function newsUpd(dt){if(!NEWS)return;const N=NEWS;N.t+=dt;const k=N.t/N.dur;if(k>=1){newsEnd();return}const u=N.m.userData,x=N.x0+(N.x1-N.x0)*k,z=2.6+Math.sin(N.t*3)*.15,y=N.y+Math.sin(N.t*1.7)*.25;
 N.m.position.set(x,y,z);N.m.rotation.y=Math.sin(N.t*6)*.12;u.rot.forEach((r,i)=>r.rotation.z=N.t*(i%2?-38:38));
 const on=Math.floor(N.t*6)%2;u.sR.emissiveIntensity=on?1.4:.15;u.sB.emissiveIntensity=on?.15:1.4;u.glow.material.color.setHex(on?0xff4d4d:0x4d8bff);u.glow.scale.setScalar(.5+.25*Math.abs(Math.sin(N.t*12)));u.sir.rotation.z=N.t*8;
 const bx=x-4.2,bz=z+.1;N.bn.position.set(bx,y+Math.sin(N.t*2.4)*.12,bz);const pa=N.rope.geometry.attributes.position;pa.setXYZ(0,x-1.1,y,z);pa.setXYZ(1,bx+2.55,N.bn.position.y,bz);pa.needsUpdate=true}

renderTitle();
function raceDex(){let h='<h3>🏰 종족 도감 <small>시작 화면에서 종족을 골라요</small></h3>';
 RK_KEYS.forEach(k=>{const r=RACE[k];h+=`<div class="cd wide ep"><div class="cn cbig" style="color:${r.col}">${r.ic} ${r.n} <small style="color:#94a3b8;font-weight:500">${r.tag}</small></div><div class="cf">${dxQ(r.fl)}</div><div class="cx">✨ ${r.p}</div><div class="cs"><span>🚫 못 쓰는 것: ${r.ban.map(id=>(TB[id]||UB[id]).n).join(', ')}</span></div></div>`;
  h+=T.filter(t=>t.race===k).map(cardT).join('')+U.filter(u=>u.race===k).map(cardU).join('')});return h}


let last=performance.now(),acc=0,pfT=0,pfN=0,pfS=0;function perfAdapt(dt){if(!R||pfS>1)return;pfT+=dt;pfN++;if(pfT>=3){const avg=pfT/pfN;pfT=0;pfN=0;if(avg>.024){pfS++;R.setPixelRatio(pfS===1?1.25:1);resize()}}}
function frame(now){requestAnimationFrame(frame);const dt=Math.min((now-last)/1000,.1);last=now;if(!S||!R)return;
 perfAdapt(dt);if(S.net==='guest'){NET.gtick(dt);if(S.cdn>0||S.cdl>0)cdnUI();acc+=dt;if(acc>.25){acc=0;ui()}}
 else if(S.cdn>0){if(!paused){S.cdn-=dt;if(S.cdn<=0)S.cdn=0}cdnUI()}else if(!paused&&!over){const d=dt*spd;for(let i=0;i<spd;i++)step(dt);acc+=d;if(acc>.25){acc=0;ui()}}
 if(S.net==='host')NET.htick(dt);
 hud();sync3(dt);minimap();if(!S.sim&&(!SHQd||SHQ.length))shopThumbTick()}
requestAnimationFrame(frame);

// ---------- 🎞 pixelfx 스프라이트 시트 재생기 (효과 출처: github.com/patch-gg/pixelfx, MIT — assets/pfx/LICENSE-pixelfx.txt) ----------
// 효과 추가: python3 tools/pfx/add.py <pixelfx 폴더> <id...> → js/pfx_sheets.js 목록 갱신. 재생: PXS.play(id, x, BH-y, z, {fit:가로 칸, sc, delay, add:빛 섞기, op:불투명도, loop, life})
const PXS=(()=>{const MAT={},act=[],M=()=>typeof PFXS_META!=='undefined'?PFXS_META:{};
 function mat(id,add,op){op=op==null?1:op;const k=id+(add?'+':'')+op;if(MAT[k])return MAT[k];const m=M()[id];const tx=new THREE.TextureLoader().load(m.f);tx.magFilter=tx.minFilter=THREE.NearestFilter;tx.generateMipmaps=false;
  return MAT[k]=new THREE.MeshBasicMaterial({map:tx,transparent:true,depthWrite:false,depthTest:false,side:THREE.DoubleSide,blending:add?THREE.AdditiveBlending:THREE.NormalBlending,opacity:op})}
 function setUV(a){const m=a.m,f=Math.min(m.n-1,a.f),c=f%m.cols,r=(f/m.cols)|0,u0=c/m.cols,u1=(c+1)/m.cols,v1=1-r/m.rows,v0=1-(r+1)/m.rows,uv=a.g.attributes.uv;
  uv.setXY(0,u0,v1);uv.setXY(1,u1,v1);uv.setXY(2,u0,v0);uv.setXY(3,u1,v0);uv.needsUpdate=true}
 function play(id,x,y,z,o){o=o||{};const sc=o.scene||(typeof Sc!=='undefined'&&Sc);if(!sc||(!o.scene&&S&&S.sim))return null;const m=M()[id];if(!m)return null;/* o.scene·o.cam: 광장처럼 다른 장면에서도 */
  const k=o.fit?o.fit/m.fw:(o.sc||1)/64,w=m.fw*k,h=m.fh*k,g=new THREE.PlaneGeometry(w,h);g.translate(-(m.px/m.fw-.5)*w,(m.py/m.fh-.5)*h,0);
  const me=new THREE.Mesh(g,mat(id,o.add,o.op));me.position.set(x,y,z||0);me.renderOrder=42;me.visible=!(o.delay>0);sc.add(me);
  const a={me,g,m,sc,cam:o.cam,t:-(o.delay||0),f:0,loop:o.loop??m.loop,life:o.life||0};setUV(a);act.push(a);return a}
 function stop(a){if(!a)return;a.dead=1}
 function update(dt){for(let i=act.length-1;i>=0;i--){const a=act[i];a.t+=dt;
   if(a.t<0){a.me.visible=false;continue}a.me.visible=true;const cm=a.cam||(typeof Cam!=='undefined'&&Cam);if(cm){a.me.quaternion.copy(cm.quaternion);a.me.scale.x=1/(a.sc.scale.x||1)}
   let f=Math.floor(a.t*a.m.fps);if(f>=a.m.n){if(a.loop&&!a.dead&&(!a.life||a.t<a.life))f%=a.m.n;else{a.sc.remove(a.me);a.g.dispose();act.splice(i,1);continue}}
   if(a.dead&&!a.loop){}if(f!==a.f){a.f=f;setUV(a)}}}
 const has=id=>!!M()[id];
 /* 여러 새 위에 나눠서(최대 n개, 조금씩 시차) */
 function some(id,us,n,o){us.slice().sort(()=>Math.random()-.5).slice(0,n).forEach((u,i)=>play(id,u.x,BH-u.y,0,Object.assign({},o,{delay:(o&&o.delay||0)+i*.08})))}
 /* 내 판 타워 위에 나눠서 */
 function towers(id,p,n,o){const L=[];p.grid.forEach((r,y)=>r.forEach((t,x)=>{if(t&&t.bp.d)L.push([cellX(x,y),BH-cellY(y)])}));L.sort(()=>Math.random()-.5).slice(0,n).forEach(([x,y],i)=>play(id,x,y,0,Object.assign({},o,{delay:i*.12})))}
 return{play,stop,update,has,some,towers,get count(){return act.length}}})();

