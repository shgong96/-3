/* ===== Utils ===== */
function pad3(n){ return String(n).padStart(3,'0'); }
function fmtKr(dateStr){
  if(!dateStr) return '';
  const [y,m,d]=dateStr.split('-');
  return `${y}년 ${m}월 ${d}일`;
}
function yyyymmdd(dateStr){ return (dateStr||'').replaceAll('-',''); }

/* ===== Numbering (localStorage, per day) ===== */
function counterKey(day){ return `ir_counter_${day}`; }
function nextNo(day){
  const k=counterKey(day);
  const cur=Number(localStorage.getItem(k)||'0');
  const next=cur+1;
  localStorage.setItem(k, String(next));
  return `IR-${day}-${pad3(next)}`;
}
function resetNo(day){ localStorage.removeItem(counterKey(day)); }

/* ===== DOM ===== */
const inputs = {
  reqNo: document.getElementById('reqNo'),
  reqDate: document.getElementById('reqDate'),
  trade: document.getElementById('trade'),
  building: document.getElementById('building'),
  floor: document.getElementById('floor'),
  unit: document.getElementById('unit'),
  receiver: document.getElementById('receiver'),
  siteRep: document.getElementById('siteRep'),
  part: document.getElementById('part'),
  inspectItem: document.getElementById('inspectItem'),
  remarks: document.getElementById('remarks'),
  inspectorName: document.getElementById('inspectorName'),
  inspectDate: document.getElementById('inspectDate'),
  inspectResult: document.getElementById('inspectResult'),
  chiefInspector: document.getElementById('chiefInspector'),
};

function readState(){
  const b=(inputs.building.value||'').trim();
  const f=(inputs.floor.value||'').trim();
  const u=(inputs.unit.value||'').trim();
  const trade=(inputs.trade.value||'').trim();

  const buildingLabel = b ? `${b}동` : '';
  const floorLabel = f ? `${f}층` : '';
  const unitLabel = u ? `${u}호` : '';

  const metaNo = `${trade}${trade && (buildingLabel||unitLabel) ? ' - ' : ''}${buildingLabel}${buildingLabel && unitLabel ? ' ' : ''}${unitLabel}`.trim();

  const locationTrade = `${buildingLabel}${buildingLabel ? ' / ' : ''}${trade}`.trim();
  const inspectPartLine = `${buildingLabel}${buildingLabel && floorLabel ? ' ' : ''}${floorLabel}${(buildingLabel||floorLabel) && (inputs.part.value||'').trim() ? ' ' : ''}${(inputs.part.value||'').trim()}`.trim();

  const docNoLine = `${trade}${trade && buildingLabel ? ' - ' : ''}${buildingLabel}${unitLabel ? ' - ' : ''}${unitLabel} 의 검측결과를 다음과 같이 통보합니다.`.replace(/\s+/g,' ').trim();

  return {
    reqNo: (inputs.reqNo.value||'').trim(),
    reqDateFmtKr: fmtKr(inputs.reqDate.value),
    receiver: inputs.receiver.value,
    siteRep: inputs.siteRep.value,
    siteRepLabel: inputs.siteRep.value ? '현장대리인' : '',
    inspectorName: inputs.inspectorName.value,
    inspectDateFmtKr: fmtKr(inputs.inspectDate.value) || '년  월  일',
    inspectItem: inputs.inspectItem.value,
    inspectResult: inputs.inspectResult.value,
    remarks: inputs.remarks.value || '시공자의 검측 체크리스트, 시공자의 도면, 공사 참여자 실명부',
    chiefInspector: inputs.chiefInspector.value,

    metaNo,
    metaNo2: metaNo,
    locationTrade,
    inspectPartLine,
    docNoLine,
    orgName: ''
  };
}

function render(){
  const s=readState();
  document.querySelectorAll('[data-bind]').forEach(el=>{
    const k=el.getAttribute('data-bind');
    el.textContent = s[k] ?? '';
  });
}

function initDates(){
  const today=new Date();
  const y=today.getFullYear();
  const m=String(today.getMonth()+1).padStart(2,'0');
  const d=String(today.getDate()).padStart(2,'0');
  const v=`${y}-${m}-${d}`;
  inputs.reqDate.value=v;
  inputs.inspectDate.value=v;
}

function issueNo(){
  const day=yyyymmdd(inputs.reqDate.value);
  if(!day){ alert('일시(요청일자)를 먼저 선택하세요.'); return; }
  inputs.reqNo.value = nextNo(day);
  render();
}

function attach(){
  Object.values(inputs).forEach(el=>{
    el.addEventListener('input', render);
    el.addEventListener('change', ()=>{
      if(el===inputs.reqDate) issueNo();
      render();
    });
  });
  document.getElementById('btnNewNo').addEventListener('click', issueNo);
  document.getElementById('btnResetCounter').addEventListener('click', ()=>{
    const day=yyyymmdd(inputs.reqDate.value);
    if(!day) return;
    if(!confirm(`${day} 날짜의 일련번호를 1부터 다시 시작할까요?`)) return;
    resetNo(day);
    issueNo();
  });
  document.getElementById('btnPrint').addEventListener('click', ()=>window.print());
}

(function main(){
  initDates();
  attach();
  issueNo();
  render();
})();
