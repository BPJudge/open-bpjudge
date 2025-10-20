import { addPage, NamedPage, $, load, Socket } from '@hydrooj/ui-default';
import Swal from 'sweetalert2';

addPage(new NamedPage('problem_detail', async () => {
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
    const prevStatus = new Map();
    const sock = new WebSocket(UiContext.ws_prefix + UiContext.pretestConnUrl);
    sock.onmessage = (message) => {
        const msg = JSON.parse(message.data);
        // console.log(msg);
        const rdoc = msg.rdoc;
        const rid = rdoc._id.toString();
        const prev = prevStatus.get(rid);
        console.log(rid, prev);
        if (rdoc.status === 1 && prev !== 1) {
            if (rdoc.uid === UserContext._id) {
                if (!rdoc.contest) {
                    showCongrats();
                }
            }
        }
        prevStatus.set(rid, rdoc.status);
    };
}));
