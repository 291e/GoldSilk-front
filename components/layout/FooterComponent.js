class FooterComponent extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
                <div class="footer">
                <div class="footer-content">
                  <div class="footer-container">
                    <span>ABOUT US</span>
                    <div class="footer-menu">
                      <span>Company : (주)메타뱅크 CEO : 소요환</span>
                      <span>Company Reg.No : 755-86-02418 통신판매업신고번호 : 2023-대전유성-1388</span>
                      <span>전화 : 042-385-1008 팩스 : 042-629-8093</span>
                      <span>Add : 대전광역시 유성구 유성대로 1646 이노비즈파크동 301호</span>
                      <span>Add : 14055 경기도 안양시 동안구 시민대로327번길 11-41 9층 909호</span>
                      <span>Add : 06065 서울 강남구 선릉로134길 6 1층 (서울본점-전시장)</span>
                      <span>Cpo_email : 소요환 (metabank@naver.com)</span>
                      <span>Technical support © ㈜메타뱅크. All rights reserved.</span>
                      </div>
                  </div>
                  <div class="footer-container">
                    <span>BANK ACCOUNT</span>
                    <div class="footer-menu">
                      <span>하나은행 : 661-910014-73404</span>
                      <span>예금주 : 주식회사메타뱅크</span>
                    </div>
                  </div>
                  <div class="footer-container">
                    <span>CS CENTER</span>
                    <div class="footer-menu">
                      <span>02-517-6004</span>
                      <span>02-2269-1008</span>
                      <span>평일 AM10:00 ~PM18:00</span>
                      <span></span>
                    </div>
                  </div>
                </div>
                
  
  
                </div>
            `;
  }
}
customElements.define("footer-component", FooterComponent);

export default FooterComponent;
