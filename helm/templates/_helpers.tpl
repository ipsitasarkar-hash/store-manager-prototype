{{/*
Create a default fully qualified app name.
*/}}
{{- define "template.name" -}}
{{- .Release.Name -}}
{{- end -}}

{{/*
Create chart name and version as used by the chart label.
*/}}
{{- define "template.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" -}}
{{- end -}}

{{/*
Common labels
*/}}
{{- define "template.labels" -}}
app.kubernetes.io/name: "{{ include "template.name" . }}"
helm.sh/chart: "{{ include "template.chart" . }}"
app.kubernetes.io/instance: "{{ .Release.Name }}"
app.kubernetes.io/managed-by: "{{ .Release.Service }}"
app: "{{ include "template.name" . }}"
version: "{{ .Chart.Version | replace "+" "_" }}"
{{- end -}}

{{/*
Labels to use on deployment.spec.selector.matchLabels and service.spec.selector
*/}}
{{- define "template.matchLabels" -}}
app.kubernetes.io/name: "engagement-layer"
app.kubernetes.io/instance: "{{ .Release.Name }}"
{{- end -}}

{{/*
Return the proper image name
*/}}
{{- define "template.image" -}}
{{- $repository := .Values.image.repository -}}
{{- $tag := .Values.image.tag | toString -}}
{{- printf "%s:%s" $repository $tag -}}
{{- end -}}
