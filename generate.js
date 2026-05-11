async function analyzeWithAI(csv) {
        const report = document.getElementById('report');
        report.innerText = ">>> 現場の異常をスキャン中...";
        
        try {
            const res = await fetch("/api/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    model: "gpt-4o",
                    messages: [
                        { 
                            role: "system", 
                            content: `あなたは20年の経験を持つベテラン物流センター長です。提供されたデータを元に、以下の3点を厳しくチェックしてください。
                            
                            1. 【異常検知】数値が急激に跳ね上がっている、または落ち込んでいる「異常」はないか？
                            2. 【ボトルネック】入荷と出荷のバランス、生産性の低下など、現場の「詰まり」はどこか？
                            3. 【即時アクション】センター長として、今すぐ現場スタッフや荷主に下すべき指示は何か？
                            
                            報告は「異常あり/なし」を明確にし、箇条書きで、現場が即動ける言葉で伝えてください。` 
                        },
                        { 
                            role: "user", 
                            content: `最新の現場データです。異常を読み取り、改善策を提示せよ：\n\n${csv}` 
                        }
                    ]
                })
            });
            const data = await aiRes.json();
            
            // エラーハンドリング
            if (data.error) throw new Error(data.error.message);

            report.innerHTML = `<h2 style="color:#ff3e3e;">⚠️ センター長 診断レポート</h2>` + data.choices[0].message.content;
        } catch (e) {
            report.innerText = "❌ 解析エラー: " + e.message;
        }
    }
