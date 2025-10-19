import { addPage, NamedPage, $, load, Socket } from '@hydrooj/ui-default';
import Swal from 'sweetalert2';

addPage(new NamedPage('record_detail', async () => {
    console.log('AC-Celebration is powered by OpenBPJudge Project https://github.com/BPJudge/open-bpjudge');
    let imageUrl = '/ac-congrats.png';
    if (UiContext.acImgUrl) imageUrl = UiContext.acImgUrl;
    let timer = 3500;
    if (UiContext.acImgDuration) timer = UiContext.acImgDuration;
    const showCongrats = () => Swal.fire({
        imageUrl,
        imageAlt: 'Congrats',
        imageWidth: 500,
        showConfirmButton: false,
        timer,
        background: 'transparent',
        padding: 0,
        width: 'auto',
    });
    if (!UiContext.socketUrl || !UiContext.rdoc) return;
    const rdoc = UiContext.rdoc;
    const sock = new Socket(UiContext.ws_prefix + UiContext.socketUrl, false, true);
    sock.onmessage = (_, data) => {
        const msg = JSON.parse(data);
        // console.log(msg);
        if (msg.status === 1 && msg.status !== rdoc.status) {
            if (rdoc && rdoc.uid === UserContext._id) {
                if (!rdoc.contest || rdoc.contest === '000000000000000000000000') {
                    showCongrats();
                }
            }
        }
    };
}));
