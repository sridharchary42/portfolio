/* =========================================================
   sridhar@cloud-infra — portfolio interactions
   ========================================================= */
(function () {
  "use strict";

  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  $("#year").textContent = new Date().getFullYear();

  /* ---------------- BOOT INTRO ---------------- */
  var bootLog = $("#bootLog"), boot = $("#boot"), booted = false;
  var bootLines = [
    "$ terraform init",
    "[ OK ] Initializing backend ............... s3://sdc-tfstate-prod",
    "[ OK ] Acquiring state lock ............... dynamodb: tf-state-lock",
    "[ OK ] Initializing modules ............... network, compute, eks",
    "[ OK ] Provider hashicorp/aws ............. v5.x",
    "",
    "$ terraform apply -auto-approve",
    "[ OK ] aws_vpc.main ....................... created",
    "[ OK ] aws_subnet.private[0..1] ........... created",
    "[ OK ] aws_lb.app ......................... active",
    "[ OK ] aws_eks_cluster.main ............... ACTIVE",
    "",
    "Apply complete. 47 added, 0 changed, 0 destroyed.",
    "",
    "  >> Welcome. Everything you see was built as code."
  ];

  function finishBoot() {
    if (booted) return;
    booted = true;
    boot.classList.add("hide");
    setTimeout(function () { boot.style.display = "none"; }, 600);
    startHeroTerm();
  }

  var bi = 0;
  function typeBoot() {
    if (booted) return;
    if (bi < bootLines.length) {
      bootLog.textContent += bootLines[bi] + "\n";
      bi++;
      setTimeout(typeBoot, bootLines[bi - 1] === "" ? 90 : 175);
    } else {
      setTimeout(finishBoot, 600);
    }
  }
  boot.addEventListener("click", finishBoot);
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") finishBoot(); });
  setTimeout(typeBoot, 300);

  /* ---------------- HERO TERMINAL ---------------- */
  var heroTerm = $("#heroTerm");
  var heroLines = [
    { t: "$ whoami", c: "c-g" },
    { t: "sridhara-chary — cloud infrastructure & devops engineer", c: "c-m" },
    { t: "", c: "" },
    { t: "$ kubectl get pods -n production", c: "c-g" },
    { t: "NAME                      READY   STATUS    AGE", c: "c-m" },
    { t: "web-7d4f9c8b6-2xk4p       1/1     Running   14d", c: "c-c" },
    { t: "web-7d4f9c8b6-9mq7v       1/1     Running   14d", c: "c-c" },
    { t: "api-5b8c7d9f4-h3n2s       1/1     Running   6d", c: "c-c" },
    { t: "", c: "" },
    { t: "$ terraform plan", c: "c-g" },
    { t: "No changes. Your infrastructure matches the configuration.", c: "c-a" },
    { t: "", c: "" },
    { t: "$ aws sts get-caller-identity --query Arn", c: "c-g" },
    { t: '"arn:aws:sts::***:assumed-role/app-s3-reader/..."', c: "c-p" },
    { t: "# credentials assumed via IRSA — nothing static in the image", c: "c-m" },
    { t: "", c: "" },
    { t: "$ open mailto:sridharachary.malloju@gmail.com", c: "c-g" },
    { t: "_", c: "c-g" }
  ];

  function startHeroTerm() {
    if (!heroTerm || heroTerm.dataset.started) return;
    heroTerm.dataset.started = "1";
    var i = 0;
    (function next() {
      if (i >= heroLines.length) return;
      var l = heroLines[i];
      var span = document.createElement("span");
      span.className = l.c;
      span.textContent = l.t + "\n";
      heroTerm.appendChild(span);
      i++;
      setTimeout(next, l.t === "" ? 110 : 230);
    })();
  }

  /* ---------------- KPI COUNTERS ---------------- */
  function runCounter(el) {
    var target = parseFloat(el.dataset.target);
    var suffix = el.dataset.suffix || "";
    var dec = (String(target).split(".")[1] || "").length;
    var start = null, dur = 1300;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = (target * eased).toFixed(dec) + suffix;
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = target.toFixed(dec) + suffix;
    }
    requestAnimationFrame(step);
  }

  /* ---------------- REVEAL + COUNTER OBSERVER ---------------- */
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add("in");
        $$(".kpi-num", e.target).forEach(function (k) {
          if (!k.dataset.ran) { k.dataset.ran = "1"; runCounter(k); }
        });
        io.unobserve(e.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    $$(".reveal").forEach(function (el) { io.observe(el); });
  } else {
    $$(".reveal").forEach(function (el) { el.classList.add("in"); });
    $$(".kpi-num").forEach(runCounter);
  }

  /* ---------------- ARCHITECTURE TRACE ---------------- */
  var steps = [
    { node: "n1", lines: [],             label: "STEP 1 / 9 · CLIENT",
      text: "A user hits <strong>app.example.com</strong>. Nothing about the request knows or cares which server will answer it — that is the whole point of what follows." },
    { node: "n2", lines: ["l1","l3"],    label: "STEP 2 / 9 · ROUTE 53",
      text: "<strong>Route 53</strong> resolves the domain to the load balancer's DNS name via an alias record. Because it is an alias rather than a CNAME, it resolves at the zone apex and costs nothing to query." },
    { node: "n3", lines: ["l2","l4"],    label: "STEP 3 / 9 · INTERNET GATEWAY",
      text: "Traffic enters the VPC through the <strong>Internet Gateway</strong>. Only the public subnets have a route table pointing 0.0.0.0/0 at the IGW — that single routing decision is what makes a subnet 'public'." },
    { node: "n4", lines: [],             label: "STEP 4 / 9 · APPLICATION LOAD BALANCER",
      text: "The <strong>ALB</strong> sits in the public subnets across two Availability Zones. It terminates TLS on its :443 listener and picks a healthy target from a target group. Failed health checks pull a target out of rotation automatically." },
    { node: "n5", lines: ["l5"],         label: "STEP 5 / 9 · SECURITY GROUPS",
      text: "The node <strong>Security Group</strong> allows inbound traffic only from the ALB's security group — referenced by group ID, not by IP range. Even if someone learns a node's private IP, they cannot reach it directly." },
    { node: "n6", lines: ["l6"],         label: "STEP 6 / 9 · EKS WORKER NODES",
      text: "The request lands on an <strong>EKS worker node</strong> in a private subnet. These nodes live in a managed node group backed by an Auto Scaling Group, so losing one triggers a replacement without human involvement." },
    { node: "n7", lines: ["l7"],         label: "STEP 7 / 9 · POD",
      text: "kube-proxy forwards to a <strong>Pod</strong> selected by the Service. The Deployment keeps the desired replica count, the readiness probe gates traffic during startup, and the HPA adds replicas when CPU climbs." },
    { node: "n8", lines: ["l8"],         label: "STEP 8 / 9 · NAT GATEWAY",
      text: "When the pod needs to reach the internet — pulling an image, calling an external API — it egresses through the <strong>NAT Gateway</strong> in the public subnet. Traffic goes out; nothing comes back in unsolicited." },
    { node: "n9", lines: ["l9"],         label: "STEP 9 / 9 · AWS SERVICES VIA IRSA",
      text: "To reach <strong>S3 or CloudWatch</strong>, the pod's service account is annotated with an IAM role ARN. It exchanges a projected token with STS for temporary credentials. No access keys are baked into the image, and the role is scoped to just what this workload needs." }
  ];

  var traceBtn = $("#traceBtn"), archExplain = $("#archExplain"), traceTimer = null;

  function clearArch() {
    $$(".node-box").forEach(function (n) { n.classList.remove("active"); });
    $$(".flow-line").forEach(function (l) { l.classList.remove("active"); });
  }

  function showStep(i, cumulative) {
    var s = steps[i];
    if (!s) return;
    if (!cumulative) clearArch();
    var g = document.getElementById(s.node);
    if (g) { var box = g.querySelector(".node-box"); if (box) box.classList.add("active"); }
    s.lines.forEach(function (id) {
      var l = document.getElementById(id);
      if (l) l.classList.add("active");
    });
    archExplain.innerHTML =
      '<div class="arch-step">' + s.label + '</div><div>' + s.text + '</div>';
  }

  $$("g[data-step]").forEach(function (g) {
    g.addEventListener("click", function () {
      if (traceTimer) { clearInterval(traceTimer); traceTimer = null; traceBtn.textContent = "▶ Run trace"; }
      showStep(parseInt(g.dataset.step, 10) - 1, false);
    });
  });

  if (traceBtn) {
    traceBtn.addEventListener("click", function () {
      if (traceTimer) {
        clearInterval(traceTimer); traceTimer = null;
        traceBtn.textContent = "▶ Run trace";
        return;
      }
      clearArch();
      var i = 0;
      traceBtn.textContent = "■ Stop";
      showStep(i, true);
      traceTimer = setInterval(function () {
        i++;
        if (i >= steps.length) {
          clearInterval(traceTimer); traceTimer = null;
          traceBtn.textContent = "▶ Run trace";
          return;
        }
        showStep(i, true);
      }, 2600);
    });
  }

  /* ---------------- CODE TOGGLES ---------------- */
  $$(".code-toggle").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var block = document.getElementById(btn.dataset.code);
      if (!block) return;
      var open = block.classList.toggle("open");
      btn.textContent = (open ? "▾ Hide" : "▸ Show") + btn.textContent.slice(btn.textContent.indexOf(" "));
    });
  });

  /* ---------------- MOBILE NAV ---------------- */
  var navToggle = $("#navToggle"), navLinks = $("#navLinks");
  if (navToggle && navLinks) {
    navToggle.addEventListener("click", function () { navLinks.classList.toggle("open"); });
    $$("a", navLinks).forEach(function (a) {
      a.addEventListener("click", function () { navLinks.classList.remove("open"); });
    });
  }
})();
